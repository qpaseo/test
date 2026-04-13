import {
  UserMemoryContent,
  UserMemoryRow,
} from "../types/entity/user-memory.entity";
import { getDatabase } from "../../../config/db/db";
import { AppError, ErrorCode } from "../../../common/errors/AppError";

export class UserMemoryRepository {
  static async createUserMemory(
    userId: string,
    content: UserMemoryContent,
  ): Promise<void> {
    try {
      const pool = getDatabase();

      await pool.query(
        `INSERT INTO user_memories (id, user_id, content, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
        [userId, content], // JSONB라 JSON.stringify 불필요
      );
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  static async getUserMemory(userId: string): Promise<UserMemoryRow | null> {
    try {
      const pool = getDatabase();

      const result = await pool.query<UserMemoryRow>(
        "SELECT * FROM user_memories WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
        [userId],
      );

      return result.rows[0] ?? null;
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }
}
