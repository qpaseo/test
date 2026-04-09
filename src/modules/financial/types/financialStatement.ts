import { RowDataPacket } from "mysql2";

export interface ExpenseItem {
  name: string;
  money: string;
}

//db 타입
export interface FinancialStatementRow extends RowDataPacket {
  id: string;
  user_id: string;
  net_monthly_income: number;
  monthly_fixed_expenses: string | null;
  monthly_savings_investment: string | null;
  created_at: string;
  updated_at: string | null;
}

//서비스 변환
export interface FinancialStatement {
  id: string;
  userId: string;
  netMonthlyIncome: number;
  monthlyFixedExpenses: ExpenseItem[] | null;
  monthlySavingsInvestment: ExpenseItem[] | null;
  createdAt: Date;
  updatedAt: Date | null;
}
