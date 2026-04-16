import { ExpenseItem } from "../../../financial/types/entity/financial-statement.entity";

export interface FinancialStatementDraft {
  netMonthlyIncome: number; // DECIMAL(14,2)
  monthlyFixedExpenses: ExpenseItem[] | null; // JSON
  monthlySavingsInvestment: ExpenseItem[] | null; // JSON
}

export interface FinancialDraftChangeProposalRow {
  id: string;
  financial_statement_draft_id: string;
  field_name: string;
  old_value: FinancialStatementDraft;
  new_value: FinancialStatementDraft;
  reason: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  created_at: string;
  updated_at: string | null;
}
