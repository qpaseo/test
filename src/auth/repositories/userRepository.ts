import { getDatabase } from "../../config/db";
import { AppError, ErrorCode } from "../../common/errors/AppError";

/**
 * 사용자 정보 인터페이스
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  has_loan: boolean;
  has_stock: boolean;
  recent_plan_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 사용자 생성 입력값
 */
export interface CreateUserInput {
  id: string;
  name: string;
  email: string;
  password: string;
  has_loan: boolean;
  has_stock: boolean;
}

/**
 * User Repository
 */
export class UserRepository {
  /**
   * 이메일로 사용자 조회
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const pool = getDatabase();
      const [rows] = await pool.query<any[]>(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "사용자 조회 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * ID로 사용자 조회
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const pool = getDatabase();
      const [rows] = await pool.query<any[]>(
        "SELECT * FROM users WHERE id = ?",
        [id],
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "사용자 조회 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * 사용자 생성
   */
  static async create(input: CreateUserInput): Promise<User> {
    try {
      const pool = getDatabase();
      const now = new Date();

      const query = `
        INSERT INTO users (id, name, email, password, has_loan, has_stock, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await pool.query(query, [
        input.id,
        input.name,
        input.email,
        input.password,
        input.has_loan,
        input.has_stock,
        now,
        now,
      ]);

      const user = await this.findById(input.id);
      if (!user) {
        throw new AppError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          "사용자 생성 후 조회에 실패했습니다",
        );
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      // MySQL 중복 키 에러
      if (error instanceof Error && error.message.includes("Duplicate entry")) {
        throw new AppError(
          ErrorCode.USER_ALREADY_EXISTS,
          "이미 존재하는 이메일입니다",
          409,
        );
      }

      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "사용자 생성 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * 사용자 업데이트
   */
  static async update(
    id: string,
    updates: Partial<CreateUserInput>,
  ): Promise<User> {
    try {
      const pool = getDatabase();

      // 동적 업데이트 쿼리 생성
      const updateFields: string[] = [];
      const values: any[] = [];

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== "id") {
          updateFields.push(`${key} = ?`);
          values.push(value);
        }
      });

      if (updateFields.length === 0) {
        const user = await this.findById(id);
        if (!user) {
          throw new AppError(
            ErrorCode.USER_NOT_FOUND,
            "사용자를 찾을 수 없습니다",
            404,
          );
        }
        return user;
      }

      values.push(id);

      const query = `UPDATE users SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id = ?`;
      await pool.query(query, values);

      const user = await this.findById(id);
      if (!user) {
        throw new AppError(
          ErrorCode.USER_NOT_FOUND,
          "사용자를 찾을 수 없습니다",
          404,
        );
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "사용자 업데이트 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * 사용자 삭제
   */
  static async delete(id: string): Promise<void> {
    try {
      const pool = getDatabase();
      await pool.query("DELETE FROM users WHERE id = ?", [id]);
    } catch (error) {
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "사용자 삭제 중 오류가 발생했습니다",
      );
    }
  }
}
