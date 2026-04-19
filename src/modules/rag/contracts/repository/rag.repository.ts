import { PdfChunkRow, PdfDocumentRow } from "../../types/internal";

export interface IRagRepository {
  insertDocument(params: {
    fileName: string;
    fileSize: number;
    pageCount: number;
    metadata: Record<string, any> | null;
  }): Promise<PdfDocumentRow>;

  insertChunks(
    chunks: {
      docId: string;
      chunkIndex: number;
      pageNumber: number;
      tokenCount: number;
      content: string;
      embedding: number[];
    }[],
  ): Promise<void>;

  findSimilarChunks(params: {
    embedding: number[];
    topK: number;
    docId?: string;
  }): Promise<PdfChunkRow[]>;

  findDocumentById(docId: string): Promise<PdfDocumentRow | null>;
}
