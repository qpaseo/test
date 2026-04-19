import { uuidv4 } from "zod";
import { getDatabase } from "../../../config/db/db";
import { FinancialGoalRow } from "../types/financialGoal";
import { AppError, ErrorCode } from "../../../common/errors/AppError";
import {
  FinancialStatement,
  FinancialStatementRow,
} from "../types/financialStatement";

/**
 * Financial Info Repository
 */
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
      const id = uuidv4();
      const now = new Date();

      const query = `
        INSERT INTO financial_goals (id, user_id, name, description, target_amount, current_amount, monthly_contribution, start_date, end_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await pool.query(query, [
        id,
        userId,
        "기본계획",
        null,
        targetAmount,
        0,
        monthlyContribution,
        null,
        null,
        now,
        now,
      ]);

      const [rows] = await pool.query<any[]>(
        "SELECT * FROM financial_goals WHERE id = ?",
        [id],
      );

      if (rows.length === 0) {
        throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
          context: "Financial Goal 생성 후 조회 실패",
          id,
        });
      }

      return rows[0];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

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
  ): Promise<FinancialStatement> {
    try {
      const pool = getDatabase();
      const id = uuidv4();
      const now = new Date();

      // monthly_savings_investment = netMonthlyIncome - monthlyFixedExpensesAmount
      const monthlySavingsInvestment = {
        amount: netMonthlyIncome - monthlyFixedExpensesAmount,
        description: "저축 및 투자 가능 금액",
      };

      const query = `
        INSERT INTO financial_statements (id, user_id, net_monthly_income, monthly_fixed_expenses, monthly_savings_investment, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await pool.query(query, [
        id,
        userId,
        netMonthlyIncome,
        JSON.stringify(monthlyFixedExpenses),
        JSON.stringify(monthlySavingsInvestment),
        now,
        now,
      ]);

      const [rows] = await pool.query<any[]>(
        "SELECT * FROM financial_statements WHERE id = ?",
        [id],
      );

      if (rows.length === 0) {
        throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
          context: "Financial Statement 생성 후 조회 실패",
          id,
        });
      }

      return rows[0];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Financial Statement 생성 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * Financial Goal(유저 목표) 조회
   */
  static async findGoalsByUserId(
    userId: string,
  ): Promise<FinancialGoalRow | null> {
    try {
      const pool = getDatabase();
      const [rows] = await pool.query<any[]>(
        `SELECT * FROM financial_goals WHERE 
        user_id = ? ORDER BY created_at DESC`,
        [userId],
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  /**
   * monthly_finances(월간 재정 상황) 조회
   */
  static async findMonthlyFinancesByUserId(userId: string) {
    try {
      const pool = getDatabase();

      const [rows] = await pool.query<any[]>(
        `
    SELECT *
    FROM monthly_finances
    WHERE user_id = ?
    ORDER BY created_at ASC
    `,
        [userId],
      );

      return rows;
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
      const [rows] = await pool.query<any[]>(
        "SELECT * FROM financial_statements WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [userId],
      );

      if (rows.length === 0) {
        return null;
      }

      return {
        ...rows[0],
        monthly_fixed_expenses: JSON.parse(rows[0].monthly_fixed_expenses),
        monthly_savings_investment: JSON.parse(
          rows[0].monthly_savings_investment,
        ),
      };
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }
}
