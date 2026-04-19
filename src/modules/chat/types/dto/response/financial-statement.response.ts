import { ExpenseItem } from "../../../../financial/types/entity/financial-statement.entity";

export interface FsResponse {
  id: string;
  netMonthlyIncome: number;
  monthlyFixedExpenses: ExpenseItem[] | null;
  monthlySavingsInvestment: ExpenseItem[] | null;
  info: string;
  createdAt: Date;
}
