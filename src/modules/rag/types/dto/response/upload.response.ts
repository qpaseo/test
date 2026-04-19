export interface UploadResponse {
  documentId: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  chunkCount: number;
  createdAt: string;
}
