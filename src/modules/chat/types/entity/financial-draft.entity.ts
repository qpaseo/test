import { ExpenseItem } from "../../../financial/types/entity/financial-statement.entity";

export interface FinancialStatementDraftRow {
  id: string;
  financial_statement_id: string;
  financial_statement_chat_room_id: string;
  user_id: string;
  net_monthly_income: number | null;
  monthly_fixed_expenses: ExpenseItem[] | null;
  monthly_savings_investment: ExpenseItem[] | null;
  status: "ACTIVE" | "COMPLETED" | "DISCARDED";
  created_at: string;
  updated_at: string | null;
}
