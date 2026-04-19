import { Request, Response } from "express";
import { ApiResponse } from "../../../types/dto/response/basic.response";
import { UploadResponse } from "../../types/dto/response/upload.response";

export interface IRagController {
  uploadPdf(
    req: Request,
    res: Response<ApiResponse<UploadResponse>>,
  ): Promise<void>;
}
