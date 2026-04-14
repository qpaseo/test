import { FinancialGoalWithProgress } from "../../types/entity/financial-goal.entity";
import { MonthlyFinance } from "../../types/entity/monthly-finances.entity";

export interface IFinancialService {
  initialize(
    userId: string,
    input: {
      targetAmount: number;
      netMonthlyIncome: number;
      monthlyFixedExpenses: { money: string }[];
    },
  ): Promise<void>;

  getGoals(userId: string): Promise<FinancialGoalWithProgress[]>;

  getMonthlyFinances(userId: string): Promise<MonthlyFinance[]>;
}
