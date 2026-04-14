import { Pool } from "pg";
import {
  UserMemoryContent,
  UserMemoryRow,
} from "../types/entity/user-memory.entity";
import { AppError, ErrorCode } from "../../../common/errors/app.error";
import { IUserMemoryRepository } from "../contracts/repository/user-memory.repository.interface";

export class UserMemoryRepository implements IUserMemoryRepository {
  constructor(private readonly db: Pool) {}

  async createUserMemory(
    userId: string,
    content: UserMemoryContent,
  ): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO user_memories (id, user_id, content, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
        [userId, content],
      );
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  async getUserMemory(userId: string): Promise<UserMemoryRow | null> {
    try {
      const result = await this.db.query<UserMemoryRow>(
        `SELECT * 
         FROM user_memories 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 1`,
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
