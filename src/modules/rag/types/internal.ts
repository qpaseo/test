//pg 라이브러리는 BIGINT를 문자열로 반환하고, Service에서 Number(row.file_size)로 변환.
export interface PdfDocumentRow {
  id: string;
  file_name: string;
  file_size: string; // BIGINT는 pg에서 string으로 반환
  page_count: number;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface PdfChunkRow {
  id: string;
  doc_id: string;
  chunk_index: number;
  page_number: number;
  token_count: number;
  content: string;
  created_at: string;
}
