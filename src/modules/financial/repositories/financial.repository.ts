import {
  FinancialGoalRow,
  FinancialGoalWithProgressRow,
} from "../types/entity/financial-goal.entity";
import { AppError, ErrorCode } from "../../../common/errors/app.error";
import {
  ExpenseItem,
  FinancialStatementRow,
} from "../types/entity/financial-statement.entity";
import { Pool } from "pg";
import { IFinancialRepository } from "../contracts/repository/financial.repository";
import { FinancialStatementInput } from "../types/dto/request/financial-statement.create.request";

export class FinancialRepository implements IFinancialRepository {
  constructor(private readonly db: Pool) {}

  async createFinancialGoal(
    userId: string,
    targetAmount: number,
    monthlyContribution: number,
  ): Promise<FinancialGoalRow> {
    try {
      const result = await this.db.query<FinancialGoalRow>(
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

  async createFinancialStatement(
    userId: string,
    netMonthlyIncome: number,
    monthlyFixedExpenses: ExpenseItem[],
    monthlyFixedExpensesAmount: number,
  ): Promise<FinancialStatementRow> {
    console.log(
      "createFinancialStatement 전달 값",
      userId,
      netMonthlyIncome,
      monthlyFixedExpenses,
      monthlyFixedExpensesAmount,
    );
    try {
      const monthlySavingsInvestment = {
        amount: netMonthlyIncome - monthlyFixedExpensesAmount,
        description: "저축 및 투자 가능 금액",
      };

      const result = await this.db.query(
        `INSERT INTO financial_statements 
    (user_id, net_monthly_income, monthly_fixed_expenses, monthly_savings_investment, info)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING *`,
        [
          userId,
          netMonthlyIncome,
          monthlyFixedExpenses,
          monthlySavingsInvestment,
          "첫 재무제표 입니다. 자동생성이기에 상세 정보는 없습니다.",
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

  async findGoalsByUserId(
    userId: string,
  ): Promise<FinancialGoalWithProgressRow[]> {
    try {
      const result = await this.db.query<FinancialGoalWithProgressRow>(
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

      return result.rows;
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  async findMonthlyFinancesByUserId(userId: string): Promise<any[]> {
    try {
      const result = await this.db.query(
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

  async getFinancialStatement(
    userId: string,
  ): Promise<FinancialStatementRow | null> {
    try {
      const result = await this.db.query<FinancialStatementRow>(
        `SELECT * FROM financial_statements WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [userId],
      );

      return result.rows[0] ?? null;
    } catch (error) {
      throw AppError.fromCode(ErrorCode.INTERNAL_SERVER_ERROR, {
        originalError: error,
      });
    }
  }

  // 유저가 직접 재무제표 업데이트 (부분 업데이트 허용)
  async updateLatestStatement(
    userId: string,
    input: FinancialStatementInput,
  ): Promise<void> {
    console.log("updateLatestStatement 전달 값", input);
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (input.net_monthly_income !== undefined) {
      fields.push(`net_monthly_income = $${index++}`);
      values.push(input.net_monthly_income);
    }

    if (input.monthly_fixed_expenses !== undefined) {
      fields.push(`monthly_fixed_expenses = $${index++}::jsonb`);
      values.push(JSON.stringify(input.monthly_fixed_expenses));
    }

    if (input.monthly_savings_investment !== undefined) {
      fields.push(`monthly_savings_investment = $${index++}::jsonb`);
      values.push(JSON.stringify(input.monthly_savings_investment));
    }

    if (!fields.length) return;
    console.log("fields", fields);
    values.push(userId);

    console.log("values before query", values);
    console.log("typeof", typeof values[1], Array.isArray(values[1]));
    console.log("first item type", typeof values[1]?.[0]);
    await this.db.query(
      `
    UPDATE financial_statements
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = (
      SELECT id FROM financial_statements
      WHERE user_id = $${index}
      ORDER BY created_at DESC
      LIMIT 1
    )
    `,
      values,
    );
  }
}
