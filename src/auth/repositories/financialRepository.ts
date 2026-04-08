import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../../config/db";
import { AppError, ErrorCode } from "../../common/errors/AppError";

/**
 * User Memory Content 인터페이스
 */
export interface UserMemoryContent {
  memory: string;
  important_information: string;
}

/**
 * Financial Goal 인터페이스
 */
export interface FinancialGoal {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Financial Statement 인터페이스
 */
export interface FinancialStatement {
  id: string;
  user_id: string;
  net_monthly_income: number;
  monthly_fixed_expenses: any; // JSON
  monthly_savings_investment: any; // JSON
  created_at: string;
  updated_at: string;
}

/**
 * Financial Info Repository
 */
export class FinancialRepository {
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
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "User Memory 생성 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * Financial Goal 생성 (기본 계획)
   */
  static async createFinancialGoal(
    userId: string,
    targetAmount: number,
    monthlyContribution: number,
  ): Promise<FinancialGoal> {
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
        throw new AppError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          "Financial Goal 생성 후 조회에 실패했습니다",
        );
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
        throw new AppError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          "Financial Statement 생성 후 조회에 실패했습니다",
        );
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
   * User Memory 조회
   */
  static async getUserMemory(userId: string): Promise<any | null> {
    try {
      const pool = getDatabase();
      const [rows] = await pool.query<any[]>(
        "SELECT * FROM user_memories WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [userId],
      );

      if (rows.length === 0) {
        return null;
      }

      return {
        ...rows[0],
        content: JSON.parse(rows[0].content),
      };
    } catch (error) {
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "User Memory 조회 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * Financial Goal 조회
   */
  static async getFinancialGoal(userId: string): Promise<FinancialGoal | null> {
    try {
      const pool = getDatabase();
      const [rows] = await pool.query<any[]>(
        "SELECT * FROM financial_goals WHERE user_id = ? AND name = ? LIMIT 1",
        [userId, "기본계획"],
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Financial Goal 조회 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * Financial Statement 조회
   */
  static async getFinancialStatement(
    userId: string,
  ): Promise<FinancialStatement | null> {
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
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Financial Statement 조회 중 오류가 발생했습니다",
      );
    }
  }
}
