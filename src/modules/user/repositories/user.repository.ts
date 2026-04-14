import { AppError, ErrorCode } from "../../../common/errors/app.error";
import { Pool } from "pg";
import { UserRow } from "../types/entity/user.entity";
import { CreateUserInput } from "../types/internal";
import { IUserRepository } from "../contracts/repository/user.repository.interface";

export class UserRepository implements IUserRepository {
  constructor(private readonly db: Pool) {}

  async findByEmail(email: string): Promise<UserRow | null> {
    try {
      const result = await this.db.query<UserRow>(
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

  async findById(id: string): Promise<UserRow | null> {
    try {
      const result = await this.db.query<UserRow>(
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

  async create(input: CreateUserInput): Promise<UserRow> {
    try {
      const result = await this.db.query<UserRow>(
        `INSERT INTO users (name, email, password, has_loan, has_stock)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
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

      if (error instanceof Error && error.message.includes("duplicate key")) {
        throw AppError.fromCode(ErrorCode.USER_ALREADY_EXISTS);
      }

      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  async update(
    id: string,
    updates: Partial<CreateUserInput>,
  ): Promise<UserRow> {
    try {
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

      const result = await this.db.query<UserRow>(
        `UPDATE users 
       SET ${updateFields.join(", ")}, updated_at = NOW() 
       WHERE id = $${paramIndex} 
       RETURNING *`,
        values,
      );

      if (!result.rows[0]) {
        throw AppError.fromCode(ErrorCode.USER_NOT_FOUND);
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

  async delete(id: string): Promise<void> {
    try {
      await this.db.query("DELETE FROM users WHERE id = $1", [id]);
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }
}
