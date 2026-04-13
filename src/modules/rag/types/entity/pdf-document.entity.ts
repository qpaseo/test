export interface PdfDocumentEntity {
  id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  metadata: Record<string, any> | null;
  createdAt: Date;
}
