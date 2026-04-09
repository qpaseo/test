import { FinancialRepository } from "../repositories/financialRepository";

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
}
