import { Pool } from "mysql2/promise";
import { ConceptRow } from "../types/entity/concept.entity";

const PAGE_SIZE = 12;

export class ConceptRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(page: number): Promise<{ rows: ConceptRow[]; total: number }> {
    const offset = (page - 1) * PAGE_SIZE;

    const [[countResult], [rows]] = await Promise.all([
      this.pool.execute<any[]>("SELECT COUNT(*) AS total FROM concepts"),
      this.pool.execute<ConceptRow[]>(
        `SELECT concept_id, name, description, category, created_at
         FROM concepts
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [PAGE_SIZE, offset],
      ),
    ]);

    return {
      rows,
      total: countResult[0].total as number,
    };
  }

  async findById(conceptId: string): Promise<ConceptRow | null> {
    const [rows] = await this.pool.execute<ConceptRow[]>(
      `SELECT concept_id, name, description, content, category, document_url, created_at
       FROM concepts
       WHERE concept_id = ?`,
      [conceptId],
    );

    return rows[0] ?? null;
  }
}
