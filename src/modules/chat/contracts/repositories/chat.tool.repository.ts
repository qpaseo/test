import { FinancialGoalRow } from "../../../financial/types/entity/financial-goal.entity";
import { FinancialStatementRow } from "../../../financial/types/entity/financial-statement.entity";
import { MonthlyFinanceRow } from "../../../financial/types/entity/monthly-finances.entity";
import {
  UserMemoryContent,
  UserMemoryRow,
} from "../../../user/types/entity/user-memory.entity";
import { FinancialStatementDraft } from "../../types/entity/financial-draft-change-proposal.entity";
import { CreateFinancialGoalInput } from "../../types/internal";

export interface IChatToolRepository {
  findUserMemoryByUserId(userId: string): Promise<UserMemoryRow | null>;

  upsertUserMemory(userId: string, content: UserMemoryContent): Promise<void>;

  findMonthlyFinance(
    userId: string,
    year: number,
    month: number,
  ): Promise<MonthlyFinanceRow | null>;

  findMonthlyFinanceRange(
    userId: string,
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number,
  ): Promise<MonthlyFinanceRow[]>;

  findGoalsByUserId(userId: string): Promise<FinancialGoalRow[]>;

  createGoal(input: CreateFinancialGoalInput): Promise<void>;

  findLatestStatementByUserId(
    userId: string,
  ): Promise<FinancialStatementRow | null>;

  findStatementsByUserId(userId: string): Promise<FinancialStatementRow[]>;

  createStatement(input: {
    id: string;
    userId: string;
    draft: FinancialStatementDraft;
    info: string;
  }): Promise<void>;

  deleteOldestStatementIfExceedsLimit(userId: string): Promise<void>;
}
