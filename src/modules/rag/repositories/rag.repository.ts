/**
 * RagRepository 주요 구현 포인트
 *
 * 1. 배치 삽입 (insertChunks)
 *    - 청크가 수십~수백 개일 수 있어 BATCH_SIZE(50) 단위로 나눠서 INSERT
 *    - 한 번에 전체를 넣으면 쿼리 크기 초과 및 DB 부하 위험
 *
 * 2. embedding 전달 방식 (insertChunks, findSimilarChunks)
 *    - pgvector는 '[0.1, 0.2, ...]' 형태의 문자열로 벡터를 받음
 *    - number[] → JSON.stringify() 변환 후 쿼리 파라미터로 전달
 *
 * 3. docId 분기 (findSimilarChunks)
 *    - docId 있음 → 해당 문서 내에서만 유사 청크 검색
 *    - docId 없음 → 전체 문서에서 유사 청크 검색
 *    - <=> 연산자는 pgvector의 코사인 유사도 거리 연산자
 */

import { Pool } from "pg";
import { IRagRepository } from "../contracts/repository/rag.repository";
import { PdfDocumentRow, PdfChunkRow } from "../types/internal";

export class RagRepository implements IRagRepository {
  constructor(private readonly db: Pool) {}

  async insertDocument(params: {
    fileName: string;
    fileSize: number;
    pageCount: number;
    metadata: Record<string, any> | null;
  }): Promise<PdfDocumentRow> {
    const { fileName, fileSize, pageCount, metadata } = params;

    const result = await this.db.query<PdfDocumentRow>(
      `INSERT INTO pdf_documents (file_name, file_size, page_count, metadata)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        fileName,
        fileSize,
        pageCount,
        metadata ? JSON.stringify(metadata) : null,
      ],
    );

    return result.rows[0];
  }

  async insertChunks(
    chunks: {
      docId: string;
      chunkIndex: number;
      pageNumber: number;
      tokenCount: number;
      content: string;
      embedding: number[];
    }[],
  ): Promise<void> {
    const BATCH_SIZE = 50;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);

      const values: any[] = [];
      const placeholders = batch.map((chunk, idx) => {
        const base = idx * 6;
        values.push(
          chunk.docId,
          chunk.chunkIndex,
          chunk.pageNumber,
          chunk.tokenCount,
          chunk.content,
          JSON.stringify(chunk.embedding),
        );
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
      });

      await this.db.query(
        `INSERT INTO pdf_chunks (doc_id, chunk_index, page_number, token_count, content, embedding)
         VALUES ${placeholders.join(", ")}`,
        values,
      );
    }
  }

  async findSimilarChunks(params: {
    embedding: number[];
    topK: number;
    docId?: string;
  }): Promise<PdfChunkRow[]> {
    const { embedding, topK, docId } = params;

    if (docId) {
      const result = await this.db.query<PdfChunkRow>(
        `SELECT id, doc_id, chunk_index, page_number, token_count, content, created_at
         FROM pdf_chunks
         WHERE doc_id = $1
         ORDER BY embedding <=> $2
         LIMIT $3`,
        [docId, JSON.stringify(embedding), topK],
      );
      return result.rows;
    }

    const result = await this.db.query<PdfChunkRow>(
      `SELECT id, doc_id, chunk_index, page_number, token_count, content, created_at
       FROM pdf_chunks
       ORDER BY embedding <=> $1
       LIMIT $2`,
      [JSON.stringify(embedding), topK],
    );

    return result.rows;
  }

  async findDocumentById(docId: string): Promise<PdfDocumentRow | null> {
    const result = await this.db.query<PdfDocumentRow>(
      `SELECT * FROM pdf_documents WHERE id = $1`,
      [docId],
    );

    return result.rows[0] ?? null;
  }
}
