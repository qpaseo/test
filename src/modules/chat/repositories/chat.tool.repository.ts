import { Pool } from "pg";
import { CreateFinancialGoalInput } from "../types/internal";
import {
  UserMemoryContent,
  UserMemoryRow,
} from "../../user/types/entity/user-memory.entity";
import { MonthlyFinanceRow } from "../../financial/types/entity/monthly-finances.entity";
import { FinancialGoalRow } from "../../financial/types/entity/financial-goal.entity";
import { FinancialStatementRow } from "../../financial/types/entity/financial-statement.entity";
import { IChatToolRepository } from "../contracts/repositories/chat.tool.repository";
import { FinancialStatementDraft } from "../types/entity/financial-draft-change-proposal.entity";

/**
 * AI Tool 에서 사용하는 공용 Repository
 */
export class ChatToolRepository implements IChatToolRepository {
  constructor(private readonly db: Pool) {}

  async findUserMemoryByUserId(userId: string): Promise<UserMemoryRow | null> {
    const result = await this.db.query<UserMemoryRow>(
      `SELECT * 
       FROM user_memories 
       WHERE user_id = $1 
       ORDER BY updated_at DESC 
       LIMIT 1`,
      [userId],
    );

    return result.rows[0] ?? null;
  }

  async upsertUserMemory(
    userId: string,
    content: UserMemoryContent,
  ): Promise<void> {
    const existing = await this.db.query<{ id: string }>(
      `SELECT id FROM user_memories WHERE user_id = $1 LIMIT 1`,
      [userId],
    );

    if (existing.rows.length > 0) {
      await this.db.query(
        `UPDATE user_memories 
         SET content = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $2`,
        [content, userId],
      );
    } else {
      const { v4: uuidv4 } = await import("uuid");

      await this.db.query(
        `INSERT INTO user_memories (id, user_id, content) 
         VALUES ($1, $2, $3)`,
        [uuidv4(), userId, content],
      );
    }
  }

  async findMonthlyFinance(
    userId: string,
    year: number,
    month: number,
  ): Promise<MonthlyFinanceRow | null> {
    const result = await this.db.query<MonthlyFinanceRow>(
      `SELECT * 
       FROM monthly_finances 
       WHERE user_id = $1 AND year = $2 AND month = $3`,
      [userId, year, month],
    );

    return result.rows[0] ?? null;
  }

  async findMonthlyFinanceRange(
    userId: string,
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number,
  ): Promise<MonthlyFinanceRow[]> {
    const result = await this.db.query<MonthlyFinanceRow>(
      `SELECT * 
       FROM monthly_finances
       WHERE user_id = $1
         AND (year * 100 + month) BETWEEN $2 AND $3
       ORDER BY year ASC, month ASC`,
      [userId, startYear * 100 + startMonth, endYear * 100 + endMonth],
    );

    return result.rows;
  }

  async findGoalsByUserId(userId: string): Promise<FinancialGoalRow[]> {
    const result = await this.db.query<FinancialGoalRow>(
      `SELECT * 
       FROM financial_goals 
       WHERE user_id = $1 
       ORDER BY created_at ASC`,
      [userId],
    );

    return result.rows;
  }

  async createGoal(input: CreateFinancialGoalInput): Promise<void> {
    await this.db.query(
      `INSERT INTO financial_goals
      (user_id, name, description, target_amount, current_amount, monthly_contribution, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        input.userId,
        input.name,
        input.description ?? null,
        input.targetAmount,
        input.currentAmount ?? 0,
        input.monthlyContribution ?? 0,
        input.startDate ?? null,
        input.endDate ?? null,
      ],
    );
  }

  async findLatestStatementByUserId(
    userId: string,
  ): Promise<FinancialStatementRow | null> {
    const result = await this.db.query<FinancialStatementRow>(
      `SELECT * 
       FROM financial_statements 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId],
    );

    return result.rows[0] ?? null;
  }

  async findStatementsByUserId(
    userId: string,
  ): Promise<FinancialStatementRow[]> {
    const result = await this.db.query<FinancialStatementRow>(
      `SELECT * 
       FROM financial_statements 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId],
    );

    return result.rows;
  }

  async createStatement(input: {
    id: string;
    userId: string;
    draft: FinancialStatementDraft;
    info: string;
  }): Promise<void> {
    console.log("createStatement 전달 값", input);
    await this.db.query(
      `
  INSERT INTO financial_statements (
    id,
    user_id,
    net_monthly_income,
    monthly_fixed_expenses,
    monthly_savings_investment,
    info
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  `,
      [
        input.id,
        input.userId,
        input.draft.netMonthlyIncome,
        input.draft.monthlyFixedExpenses
          ? JSON.stringify(input.draft.monthlyFixedExpenses)
          : null,
        input.draft.monthlySavingsInvestment
          ? JSON.stringify(input.draft.monthlySavingsInvestment)
          : null,
        input.info,
      ],
    );
  }

  async deleteOldestStatementIfExceedsLimit(userId: string): Promise<void> {
    const statements = await this.findStatementsByUserId(userId);

    if (statements.length >= 2) {
      const oldest = statements.at(-1);
      if (!oldest) return;

      await this.db.query(`DELETE FROM financial_statements WHERE id = $1`, [
        oldest.id,
      ]);
    }
  }
}
