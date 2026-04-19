import { IFinancialRepository } from "../contracts/repository/financial.repository";
import { IFinancialService } from "../contracts/service/financial.service";
import {
  FinancialGoalWithProgress,
  FinancialGoalWithProgressRow,
} from "../types/entity/financial-goal.entity";
import { MonthlyFinance } from "../types/entity/monthly-finances.entity";

export class FinancialService implements IFinancialService {
  constructor(private readonly financialRepository: IFinancialRepository) {}

  async initialize(
    userId: string,
    input: {
      targetAmount: number;
      netMonthlyIncome: number;
      monthlyFixedExpenses: { money: string }[];
    },
  ): Promise<void> {
    const fixedExpensesTotal = input.monthlyFixedExpenses.reduce(
      (sum, expense) => sum + Number.parseFloat(expense.money),
      0,
    );

    const monthlyContribution = input.netMonthlyIncome - fixedExpensesTotal;

    await this.financialRepository.createFinancialGoal(
      userId,
      input.targetAmount,
      monthlyContribution,
    );

    await this.financialRepository.createFinancialStatement(
      userId,
      input.netMonthlyIncome,
      input.monthlyFixedExpenses,
      fixedExpensesTotal,
    );
  }

  async getGoals(userId: string): Promise<FinancialGoalWithProgress[]> {
    const rows = await this.financialRepository.findGoalsByUserId(userId);

    return rows.map((row: FinancialGoalWithProgressRow) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      targetAmount: Number(row.target_amount),
      currentAmount: Number(row.current_amount),
      monthlyContribution: Number(row.monthly_contribution),
      startDate: row.start_date ? new Date(row.start_date) : null,
      endDate: row.end_date ? new Date(row.end_date) : null,
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
      progressPercentage: Number(row.progress_percentage),
    }));
  }

  async getMonthlyFinances(userId: string): Promise<MonthlyFinance[]> {
    const rows =
      await this.financialRepository.findMonthlyFinancesByUserId(userId);

    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      year: row.year,
      month: row.month,
      income: Number(row.income),
      expense: Number(row.expense),
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    }));
  }
}
