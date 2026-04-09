import { FinancialRepository } from "../repositories/financialRepository";
import { FinancialGoalRow } from "../types/financialGoal";
import { MonthlyFinance } from "../types/monthlyFinances";

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
    // 고정 지출 총액 계산
    const fixedExpensesTotal = input.monthlyFixedExpenses.reduce(
      (sum, expense) => sum + Number.parseFloat(expense.money),
      0,
    );

    // 월 투자 가능 금액
    const monthlyContribution = input.netMonthlyIncome - fixedExpensesTotal;

    // Financial Goal 생성
    await FinancialRepository.createFinancialGoal(
      userId,
      input.targetAmount,
      monthlyContribution,
    );

    // Financial Statement 생성
    await FinancialRepository.createFinancialStatement(
      userId,
      input.netMonthlyIncome,
      input.monthlyFixedExpenses,
      fixedExpensesTotal,
    );
  }

  /**
   * 유저 목표 조회
   * @param userId
   * @returns
   */
  static async getGoals(userId: string) {
    const rows = await FinancialRepository.findGoalsByUserId(userId);

    return rows?.map((row: FinancialGoalRow) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      targetAmount: Number(row.target_amount),
      currentAmount: Number(row.current_amount),
      monthlyContribution: Number(row.monthly_contribution),
      startDate: row.start_date ? new Date(row.start_date) : null,
      endDate: row.end_date ? new Date(row.end_date) : null,
      createdAt: new Date(row.created_at),
    }));
  }

  /**
   * 유저 재정상황 달별로 생성시간에 맞추어 정렬하여 반환
   * @param userId
   * @returns
   */
  static async getMonthlyFinances(userId: string): Promise<MonthlyFinance[]> {
    const rows = await FinancialRepository.findMonthlyFinancesByUserId(userId);

    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      year: row.year,
      month: row.month,
      income: row.income ? JSON.parse(row.income) : {},
      expense: row.expense ? JSON.parse(row.expense) : {},
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    }));
  }
}
