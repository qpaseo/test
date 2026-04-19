import { ConceptRow, ConceptSummaryRow } from "../types/entity/concept.entity";
import { IConceptRepository } from "../contracts/repository/concepts.repository";
import { Pool } from "pg";

export class ConceptRepository implements IConceptRepository {
  constructor(private readonly db: Pool) {}

  async findAll(
    page: number,
  ): Promise<{ rows: ConceptSummaryRow[]; total: number }> {
    const PAGE_SIZE = 12;
    const offset = (page - 1) * PAGE_SIZE;

    const [countResult, rowsResult] = await Promise.all([
      this.db.query<{ total: string }>(
        "SELECT COUNT(*) AS total FROM concepts",
      ),
      this.db.query<ConceptSummaryRow>(
        `SELECT concept_id, name, description, category, created_at
         FROM concepts
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [PAGE_SIZE, offset],
      ),
    ]);

    return {
      rows: rowsResult.rows,
      total: Number.parseInt(countResult.rows[0].total, 10),
    };
  }

  async findById(conceptId: string): Promise<ConceptRow | null> {
    const result = await this.db.query<ConceptRow>(
      `SELECT concept_id, name, description, content, category, document_url, created_at
       FROM concepts
       WHERE concept_id = $1`,
      [conceptId],
    );

    return result.rows[0] ?? null;
  }
}
