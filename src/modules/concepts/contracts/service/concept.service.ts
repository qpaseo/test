import {
  ConceptDetailResponse,
  ConceptListResponse,
} from "../../types/dto/response/concept-list.response";

export interface IConceptService {
  getConceptList(page: number): Promise<ConceptListResponse>;
  getConceptById(conceptId: string): Promise<ConceptDetailResponse>;
}
