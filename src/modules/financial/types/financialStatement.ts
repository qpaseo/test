import { RowDataPacket } from "mysql2";

export interface ExpenseItem {
  name: string;
  money: string;
}

export interface FinancialStatement {
  id: string;
  user_id: string;
  net_monthly_income: string; // DECIMAL → string
  monthly_fixed_expenses: ExpenseItem[] | null; // JSON 구조 반영
  monthly_savings_investment: ExpenseItem[] | null; // JSON 구조 반영
  created_at: Date;
  updated_at: Date | null;
}

export interface FinancialStatementRow extends RowDataPacket {
  id: string;
  user_id: string;
  net_monthly_income: number;
  monthly_fixed_expenses: any; // JSON
  monthly_savings_investment: any; // JSON
  created_at: string;
  updated_at: string;
}
