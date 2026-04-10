import { Response } from "express";
import { ConceptService } from "../services/conceptService";
import {
  AuthenticatedRequest,
  ApiResponse,
} from "../../types/dto/response/basic.response";
import {
  ConceptIdParamSchema,
  ConceptListQuerySchema,
} from "../validators/conceptValidator";
import {
  ConceptDetailResponse,
  ConceptListResponse,
} from "../types/dto/response/concept-list.response";
import { handleAuthError } from "../../../common/errors/HandleAuthError";

export class ConceptController {
  constructor(private readonly conceptService: ConceptService) {}

  getConceptList = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<ConceptListResponse>>,
  ): Promise<void> => {
    try {
      const { page } = ConceptListQuerySchema.parse(req.query);

      const result = await this.conceptService.getConceptList(page);

      res.status(200).json({
        success: true,
        code: "Concepts retrieved successfully",
        message: "컨셉 리스트가 성공적으로 조회되었습니다.",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  getConceptById = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<ConceptDetailResponse>>,
  ): Promise<void> => {
    try {
      const { id } = ConceptIdParamSchema.parse(req.params);

      const concept = await this.conceptService.getConceptById(id);

      res.status(200).json({
        success: true,
        code: "Concept retrieved successfully",
        message: "컨셉이 성공적으로 조회되었습니다.",
        data: concept,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };
}
