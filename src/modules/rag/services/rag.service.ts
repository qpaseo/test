import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { UploadResponse } from "../types/dto/response/upload.response";
import { UploadQuery } from "../validators/rag.validator";
import { encodingForModel } from "js-tiktoken";
import {
  IEmbeddingClient,
  IRagService,
} from "../contracts/service/rag.service";
import { IRagRepository } from "../contracts/repository/rag.repository";

/**
 * 서비스 구현 포인트
 *
 * 1. 청킹 전략
 *    - text-embedding-3-small 최대 입력: 8191 토큰
 *    - 안전하게 512토큰 단위로 청킹, 50토큰 오버랩
 *    - js-tiktoken의 encodingForModel로 정확한 토큰 경계에서 청킹
 *
 * 2. 페이지별 텍스트 추출
 *    - pdfjs-dist로 페이지 단위 추출 → page_number 정확하게 저장 가능
 *    - pdf-parse는 전체 텍스트만 반환해 페이지 구분 불가
 *
 * 3. 임베딩 배치 처리
 *    - OpenAI 임베딩 API 요청을 청크 단위로 배치 처리
 *    - 한 번에 너무 많은 요청 시 rate limit 위험 → 20개씩 나눠서 요청
 *
 * 4. encoder 생명주기
 *    - encoder는 uploadPdf 호출마다 새로 생성
 *    - finally 블록에서 반드시 free() 호출해 메모리 누수 방지
 */

export class RagService implements IRagService {
  private readonly CHUNK_TOKEN_SIZE = 512;
  private readonly CHUNK_OVERLAP_TOKEN = 50;
  private readonly EMBEDDING_BATCH_SIZE = 20;

  constructor(
    private readonly ragRepository: IRagRepository,
    private readonly embeddingClient: IEmbeddingClient,
  ) {}

  // rag.service.ts
  async searchChunks(
    query: string,
    topK: number = 5,
    docId?: string,
  ): Promise<{ content: string; pageNumber: number }[]> {
    const embeddings = await this.embeddingClient.createEmbeddings([query]);

    const chunks = await this.ragRepository.findSimilarChunks({
      embedding: embeddings[0],
      topK,
      docId,
    });

    return chunks.map((c) => ({
      content: c.content,
      pageNumber: c.page_number,
    }));
  }

  async uploadPdf(
    file: Express.Multer.File,
    query: UploadQuery,
  ): Promise<UploadResponse> {
    const encoder = encodingForModel("text-embedding-3-small");

    try {
      const { pages, pageCount } = await this.extractPagesFromPdf(file.buffer);

      const rawChunks = this.buildChunks(pages, encoder);

      const documentRow = await this.ragRepository.insertDocument({
        fileName: file.originalname,
        fileSize: file.size,
        pageCount,
        metadata: query.metadata,
      });

      const chunksWithEmbedding = await this.generateEmbeddings(rawChunks);

      await this.ragRepository.insertChunks(
        chunksWithEmbedding.map((chunk) => ({
          docId: documentRow.id,
          chunkIndex: chunk.chunkIndex,
          pageNumber: chunk.pageNumber,
          tokenCount: chunk.tokenCount,
          content: chunk.content,
          embedding: chunk.embedding,
        })),
      );

      return {
        documentId: documentRow.id,
        fileName: documentRow.file_name,
        fileSize: Number(documentRow.file_size),
        pageCount: documentRow.page_count,
        chunkCount: chunksWithEmbedding.length,
        createdAt: documentRow.created_at,
      };
    } finally {
      if (typeof (encoder as any).free === "function") {
        (encoder as any).free();
      }
    }
  }

  private async extractPagesFromPdf(buffer: Buffer): Promise<{
    pages: { pageNumber: number; text: string }[];
    pageCount: number;
  }> {
    const uint8Array = new Uint8Array(buffer);
    const pdf = await pdfjs.getDocument({ data: uint8Array }).promise;
    const pageCount = pdf.numPages;
    const pages: { pageNumber: number; text: string }[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ")
        .trim();

      if (text.length > 0) {
        pages.push({ pageNumber: i, text });
      }
    }

    return { pages, pageCount };
  }

  private buildChunks(
    pages: { pageNumber: number; text: string }[],
    encoder: ReturnType<typeof encodingForModel>,
  ): {
    chunkIndex: number;
    pageNumber: number;
    tokenCount: number;
    content: string;
  }[] {
    const chunks: {
      chunkIndex: number;
      pageNumber: number;
      tokenCount: number;
      content: string;
    }[] = [];

    let chunkIndex = 0;

    for (const { pageNumber, text } of pages) {
      const tokens = encoder.encode(text);
      let start = 0;

      while (start < tokens.length) {
        const end = Math.min(start + this.CHUNK_TOKEN_SIZE, tokens.length);
        const chunkTokens = tokens.slice(start, end);
        const content = new TextDecoder()
          .decode(encoder.decode(chunkTokens) as unknown as Uint8Array)
          .trim();

        if (content.length > 0) {
          chunks.push({
            chunkIndex: chunkIndex++,
            pageNumber,
            tokenCount: chunkTokens.length,
            content,
          });
        }

        start += this.CHUNK_TOKEN_SIZE - this.CHUNK_OVERLAP_TOKEN;
      }
    }

    return chunks;
  }

  private async generateEmbeddings(
    chunks: {
      chunkIndex: number;
      pageNumber: number;
      tokenCount: number;
      content: string;
    }[],
  ): Promise<
    {
      chunkIndex: number;
      pageNumber: number;
      tokenCount: number;
      content: string;
      embedding: number[];
    }[]
  > {
    const result: {
      chunkIndex: number;
      pageNumber: number;
      tokenCount: number;
      content: string;
      embedding: number[];
    }[] = [];

    for (let i = 0; i < chunks.length; i += this.EMBEDDING_BATCH_SIZE) {
      const batch = chunks.slice(i, i + this.EMBEDDING_BATCH_SIZE);

      const embeddings = await this.embeddingClient.createEmbeddings(
        batch.map((c) => c.content),
      );

      batch.forEach((chunk, idx) => {
        result.push({
          ...chunk,
          embedding: embeddings[idx],
        });
      });
    }

    return result;
  }
}
