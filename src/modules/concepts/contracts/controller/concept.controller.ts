import { Response } from "express";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../../types/dto/response/basic.response";
import {
  ConceptDetailResponse,
  ConceptListResponse,
} from "../../types/dto/response/concept-list.response";

export interface IConceptController {
  getConceptList(
    req: AuthenticatedRequest,
    res: Response<ApiResponse<ConceptListResponse>>,
  ): Promise<void>;

  getConceptById(
    req: AuthenticatedRequest,
    res: Response<ApiResponse<ConceptDetailResponse>>,
  ): Promise<void>;
}
