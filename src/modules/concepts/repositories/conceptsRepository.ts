import { Pool } from "pg";
import { ConceptRow } from "../types/entity/concept.entity";

const PAGE_SIZE = 12;

export class ConceptRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(page: number): Promise<{ rows: ConceptRow[]; total: number }> {
    const offset = (page - 1) * PAGE_SIZE;

    const [countResult, rowsResult] = await Promise.all([
      this.pool.query<{ total: string }>(
        "SELECT COUNT(*) AS total FROM concepts",
      ),
      this.pool.query<ConceptRow>(
        `SELECT concept_id, name, description, category, created_at
         FROM concepts
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [PAGE_SIZE, offset],
      ),
    ]);

    return {
      rows: rowsResult.rows,
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async findById(conceptId: string): Promise<ConceptRow | null> {
    const result = await this.pool.query<ConceptRow>(
      `SELECT concept_id, name, description, content, category, document_url, created_at
       FROM concepts
       WHERE concept_id = $1`,
      [conceptId],
    );

    return result.rows[0] ?? null;
  }
}
