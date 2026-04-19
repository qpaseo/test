import {
  ConceptRow,
  ConceptSummaryRow,
} from "../../types/entity/concept.entity";

export interface IConceptRepository {
  findAll(page: number): Promise<{ rows: ConceptSummaryRow[]; total: number }>;

  findById(conceptId: string): Promise<ConceptRow | null>;
}
