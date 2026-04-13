import { FinancialRepository } from "../repositories/financialRepository";
import {
  FinancialGoalWithProgress,
  FinancialGoalWithProgressRow,
} from "../types/entity/financial-goal.entity";
import { MonthlyFinance } from "../types/entity/monthly-finances.entity";

export class FinancialService {
  /**
   * 회원가입 시 재무 데이터 초기화
   */
  static async initialize(
    userId: string,
    input: {
      targetAmount: number;
      netMonthlyIncome: number;
      monthlyFixedExpenses: { money: string }[];
    },
  ) {
    const fixedExpensesTotal = input.monthlyFixedExpenses.reduce(
      (sum, expense) => sum + Number.parseFloat(expense.money),
      0,
    );

    const monthlyContribution = input.netMonthlyIncome - fixedExpensesTotal;

    await FinancialRepository.createFinancialGoal(
      userId,
      input.targetAmount,
      monthlyContribution,
    );

    await FinancialRepository.createFinancialStatement(
      userId,
      input.netMonthlyIncome,
      input.monthlyFixedExpenses,
      fixedExpensesTotal,
    );
  }

  /**
   * 유저 목표 조회
   */
  static async getGoals(userId: string): Promise<FinancialGoalWithProgress[]> {
    const rows = await FinancialRepository.findGoalsByUserId(userId);

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

  /**
   * 유저 재정상황 달별 조회
   */
  static async getMonthlyFinances(userId: string): Promise<MonthlyFinance[]> {
    const rows = await FinancialRepository.findMonthlyFinancesByUserId(userId);

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
