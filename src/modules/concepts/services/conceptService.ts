import { AppError, ErrorCode } from "../../../common/errors/AppError";
import { ConceptRepository } from "../repositories/conceptsRepository";
import {
  ConceptDetailResponse,
  ConceptListItemResponse,
  ConceptListResponse,
} from "../types/dto/response/concept-list.response";
import { Concept, ConceptRow } from "../types/entity/concept.entity";

export class ConceptService {
  constructor(private readonly conceptRepository: ConceptRepository) {}

  // ── Row → Entity ──────────────────────────────────────────────
  private toEntity(row: ConceptRow): Concept {
    return {
      conceptId: row.concept_id,
      name: row.name,
      description: row.description,
      content: row.content,
      category: row.category
        ? (JSON.parse(row.category) as Record<string, string>)
        : null,
      documentUrl: row.document_url,
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    };
  }

  // ── Entity → DTO (list item) ──────────────────────────────────
  private toListItemDto(entity: Concept): ConceptListItemResponse {
    return {
      conceptId: entity.conceptId,
      name: entity.name,
      description: entity.description,
      category: entity.category ? Object.values(entity.category) : [],
      createdAt: entity.createdAt.toISOString(),
    };
  }

  // ── Entity → DTO (detail) ─────────────────────────────────────
  private toDetailDto(entity: Concept): ConceptDetailResponse {
    return {
      name: entity.name,
      description: entity.description,
      content: entity.content,
      category: entity.category ? Object.values(entity.category) : [],
      documentUrl: entity.documentUrl,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  // ── 리스트 조회 (12개 페이지네이션) ──────────────────────────
  async getConceptList(page: number): Promise<ConceptListResponse> {
    const { rows, total } = await this.conceptRepository.findAll(page);

    const items = rows.map((row) => this.toListItemDto(this.toEntity(row)));

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / 12),
    };
  }

  // ── 상세 조회 ────────────────────────────────────────────────
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
