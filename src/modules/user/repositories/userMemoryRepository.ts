import { uuidv4 } from "zod";
import {
  UserMemoryContent,
  UserMemoryRow,
} from "../types/entity/user-memory.entity";
import { getDatabase } from "../../../config/db/db";
import { AppError, ErrorCode } from "../../../common/errors/AppError";

export class UserMemoryRepository {
  /**
   * User Memory 생성
   */
  static async createUserMemory(
    userId: string,
    content: UserMemoryContent,
  ): Promise<void> {
    try {
      const pool = getDatabase();
      const id = uuidv4();
      const now = new Date();

      const query = `
        INSERT INTO user_memories (id, user_id, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `;

      await pool.query(query, [id, userId, JSON.stringify(content), now, now]);
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  /**
   * User Memory 조회
   */
  static async getUserMemory(userId: string): Promise<UserMemoryRow | null> {
    try {
      const pool = getDatabase();

      // 제네릭에 UserMemoryRow[]를 명시하여 타입을 추론합니다.
      const [rows] = await pool.query<UserMemoryRow[]>(
        "SELECT * FROM user_memories WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [userId],
      );

      if (rows.length === 0) {
        return null;
      }

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }
}
