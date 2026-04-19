import { FinancialStatementInput } from "../../types/dto/request/financial-statement.create.request";
import {
  FinancialGoalRow,
  FinancialGoalWithProgressRow,
} from "../../types/entity/financial-goal.entity";
import { FinancialStatementRow } from "../../types/entity/financial-statement.entity";

export interface IFinancialRepository {
  createFinancialGoal(
    userId: string,
    targetAmount: number,
    monthlyContribution: number,
  ): Promise<FinancialGoalRow>;

  createFinancialStatement(
    userId: string,
    netMonthlyIncome: number,
    monthlyFixedExpenses: any,
    monthlyFixedExpensesAmount: number,
  ): Promise<FinancialStatementRow>;

  findGoalsByUserId(userId: string): Promise<FinancialGoalWithProgressRow[]>;

  findMonthlyFinancesByUserId(userId: string): Promise<any[]>;

  getFinancialStatement(userId: string): Promise<FinancialStatementRow | null>;

  updateLatestStatement(
    userId: string,
    input: FinancialStatementInput,
  ): Promise<void>;
}
