import { UploadResponse } from "../../types/dto/response/upload.response";
import { UploadQuery } from "../../validators/rag.validator";

export interface IEmbeddingClient {
  createEmbeddings(inputs: string[]): Promise<number[][]>;
}

export interface IRagService {
  uploadPdf(
    file: Express.Multer.File,
    query: UploadQuery,
  ): Promise<UploadResponse>;

  searchChunks(
    query: string,
    topK: number,
    docId?: string,
  ): Promise<{ content: string; pageNumber: number }[]>;
}
