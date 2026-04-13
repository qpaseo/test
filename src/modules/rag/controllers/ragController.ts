import { Request, Response } from "express";
import { RagService } from "../services/ragService";
import { RagRepository } from "../repositories/ragRepository";
import { ApiResponse } from "../../types/dto/response/basic.response";
import { UploadResponse } from "../types/dto/response/upload.response";
import { UploadQuerySchema } from "../validators/ragValidator";
import { handleAuthError } from "../../../common/errors/HandleAuthError";

const ragRepository = new RagRepository();
const ragService = new RagService(ragRepository);

export class RagController {
  // ============= PDF 업로드 =============
  uploadPdf = async (
    req: Request,
    res: Response<ApiResponse<UploadResponse>>,
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          code: "INVALID_REQUEST",
          message: "PDF 파일이 필요합니다.",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (req.file.mimetype !== "application/pdf") {
        res.status(400).json({
          success: false,
          code: "INVALID_FILE_TYPE",
          message: "PDF 파일만 업로드 가능합니다.",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const query = UploadQuerySchema.parse(req.query);
      const result = await ragService.uploadPdf(req.file, query);

      res.status(201).json({
        success: true,
        code: "PDF_UPLOADED",
        message: "PDF가 성공적으로 업로드되었습니다.",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };
}
