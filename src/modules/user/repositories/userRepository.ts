import { AppError, ErrorCode } from "../../../common/errors/AppError";
import { getDatabase } from "../../../config/db/db";
import { UserRow } from "../types/entity/user.entity";
import { CreateUserInput } from "../types/internal";

export class UserRepository {
  static async findByEmail(email: string): Promise<UserRow | null> {
    try {
      const pool = getDatabase();

      const result = await pool.query<UserRow>(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );

      return result.rows[0] ?? null;
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  static async findById(id: string): Promise<UserRow | null> {
    try {
      const pool = getDatabase();

      const result = await pool.query<UserRow>(
        "SELECT * FROM users WHERE id = $1",
        [id],
      );

      return result.rows[0] ?? null;
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  static async create(input: CreateUserInput): Promise<UserRow> {
    try {
      const pool = getDatabase();

      const result = await pool.query<UserRow>(
        `INSERT INTO users (id, name, email, password, has_loan, has_stock, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING *`,
        [
          input.id,
          input.name,
          input.email,
          input.password,
          input.has_loan,
          input.has_stock,
        ],
      );

      return result.rows[0];
    } catch (error) {
      if (error instanceof AppError) throw error;

      // PostgreSQL 중복 키 에러
      if (error instanceof Error && error.message.includes("duplicate key")) {
        throw AppError.fromCode(ErrorCode.USER_ALREADY_EXISTS);
      }

      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  static async update(
    id: string,
    updates: Partial<CreateUserInput>,
  ): Promise<UserRow> {
    try {
      const pool = getDatabase();

      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== "id") {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      if (updateFields.length === 0) {
        const user = await this.findById(id);
        if (!user) throw AppError.fromCode(ErrorCode.USER_NOT_FOUND);
        return user;
      }

      values.push(id);

      const result = await pool.query<UserRow>(
        `UPDATE users SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
        values,
      );

      if (!result.rows[0]) {
        throw new AppError(
          ErrorCode.USER_NOT_FOUND,
          "사용자를 찾을 수 없습니다",
          404,
        );
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "사용자 업데이트 중 오류가 발생했습니다",
      );
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const pool = getDatabase();
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }
}
