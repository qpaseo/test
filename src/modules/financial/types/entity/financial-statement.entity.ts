export interface ExpenseItem {
  name: string;
  money: number;
}

// db 타입
export interface FinancialStatementRow {
  id: string;
  user_id: string;
  net_monthly_income: number;
  monthly_fixed_expenses: ExpenseItem[] | null; // JSONB 자동 파싱
  monthly_savings_investment: ExpenseItem[] | null; // JSONB 자동 파싱
  info: string;
  created_at: string;
  updated_at: string | null;
}

// 서비스 변환
export interface FinancialStatement {
  id: string;
  userId: string;
  netMonthlyIncome: number;
  monthlyFixedExpenses: ExpenseItem[] | null;
  monthlySavingsInvestment: ExpenseItem[] | null;
  createdAt: Date;
  updatedAt: Date | null;
}
