//Entity에는 embedding을 포함하지 않음. 벡터는 DB 내부에서만 쓰이고 서비스 레이어로 올라올 필요가 없어서 포함하지 않음
export interface PdfChunkEntity {
  id: string;
  docId: string;
  chunkIndex: number;
  pageNumber: number;
  tokenCount: number;
  content: string;
  createdAt: Date;
}
