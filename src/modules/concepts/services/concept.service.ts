import { AppError, ErrorCode } from "../../../common/errors/app.error";
import { IConceptService } from "../contracts/service/concept.service";
import { IConceptRepository } from "../contracts/repository/concepts.repository";
import {
  ConceptDetailResponse,
  ConceptListItemResponse,
  ConceptListResponse,
} from "../types/dto/response/concept-list.response";
import {
  Concept,
  ConceptRow,
  ConceptSummaryRow,
} from "../types/entity/concept.entity";

export class ConceptService implements IConceptService {
  constructor(private readonly conceptRepository: IConceptRepository) {}

  private toEntity(row: ConceptRow): Concept {
    return {
      conceptId: row.concept_id,
      name: row.name,
      description: row.description,
      content: row.content,
      category: row.category,
      documentUrl: row.document_url,
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    };
  }

  private toListItemDto(row: ConceptSummaryRow): ConceptListItemResponse {
    return {
      conceptId: row.concept_id,
      name: row.name,
      description: row.description,
      category: row.category ?? [],
      createdAt: row.created_at,
    };
  }

  private toDetailDto(entity: Concept): ConceptDetailResponse {
    return {
      id: entity.conceptId,
      name: entity.name,
      description: entity.description,
      content: entity.content,
      category: entity.category ?? [],
      documentUrl: entity.documentUrl,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  async getConceptList(page: number): Promise<ConceptListResponse> {
    const { rows, total } = await this.conceptRepository.findAll(page);

    const items = rows.map((row) => this.toListItemDto(row));

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / 12),
    };
  }

  async getConceptById(conceptId: string): Promise<ConceptDetailResponse> {
    const row = await this.conceptRepository.findById(conceptId);

    if (!row) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        "요청한 개념을 찾을수 없습니다.",
        400,
      );
    }

    return this.toDetailDto(this.toEntity(row));
  }
}
