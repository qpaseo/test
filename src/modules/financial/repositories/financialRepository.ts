import { getDatabase } from "../../../config/db/db";
import {
  FinancialGoalRow,
  FinancialGoalWithProgressRow,
} from "../types/entity/financial-goal.entity";
import { AppError, ErrorCode } from "../../../common/errors/AppError";
import { FinancialStatementRow } from "../types/entity/financial-statement.entity";

export class FinancialRepository {
  /**
   * Financial Goal 생성 (기본 계획)
   */
  static async createFinancialGoal(
    userId: string,
    targetAmount: number,
    monthlyContribution: number,
  ): Promise<FinancialGoalRow> {
    try {
      const pool = getDatabase();

      const result = await pool.query<FinancialGoalRow>(
        `INSERT INTO financial_goals 
          (id, user_id, name, description, target_amount, current_amount, monthly_contribution, start_date, end_date, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         RETURNING *`,
        [
          userId,
          "기본계획",
          null,
          targetAmount,
          0,
          monthlyContribution,
          null,
          null,
        ],
      );

      if (result.rows.length === 0) {
        throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
          context: "Financial Goal 생성 후 조회 실패",
        });
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Financial Goal 생성 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * Financial Statement 생성
   */
  static async createFinancialStatement(
    userId: string,
    netMonthlyIncome: number,
    monthlyFixedExpenses: any,
    monthlyFixedExpensesAmount: number,
  ): Promise<FinancialStatementRow> {
    try {
      const pool = getDatabase();

      const monthlySavingsInvestment = {
        amount: netMonthlyIncome - monthlyFixedExpensesAmount,
        description: "저축 및 투자 가능 금액",
      };

      const result = await pool.query<FinancialStatementRow>(
        `INSERT INTO financial_statements 
          (id, user_id, net_monthly_income, monthly_fixed_expenses, monthly_savings_investment, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [
          userId,
          netMonthlyIncome,
          monthlyFixedExpenses,
          monthlySavingsInvestment,
        ],
      );

      if (result.rows.length === 0) {
        throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
          context: "Financial Statement 생성 후 조회 실패",
        });
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Financial Statement 생성 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * Financial Goal 조회
   */
  static async findGoalsByUserId(
    userId: string,
  ): Promise<FinancialGoalWithProgressRow[]> {
    // 단일 -> 배열

    try {
      const pool = getDatabase();

      const result = await pool.query<FinancialGoalWithProgressRow>(
        `
        SELECT 
          *,
          CASE 
            WHEN target_amount = 0 THEN 0
            ELSE ROUND((current_amount::numeric / target_amount::numeric) * 100, 2)
          END AS progress_percentage
        FROM financial_goals
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
        [userId],
      );

      return result.rows; // rows[0] -> rows
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  /**
   * monthly_finances 조회
   */
  static async findMonthlyFinancesByUserId(userId: string) {
    try {
      const pool = getDatabase();

      const result = await pool.query(
        `SELECT * FROM monthly_finances WHERE user_id = $1 ORDER BY created_at ASC`,
        [userId],
      );

      return result.rows;
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  /**
   * Financial Statement 조회
   */
  static async getFinancialStatement(
    userId: string,
  ): Promise<FinancialStatementRow | null> {
    try {
      const pool = getDatabase();

      const result = await pool.query<FinancialStatementRow>(
        `SELECT * FROM financial_statements WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [userId],
      );

      return result.rows[0] ?? null; // JSONB라 JSON.parse 불필요
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }
}
