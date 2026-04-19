import { ExpenseItem } from "../../entity/financial-statement.entity";

export interface FinancialStatementInput {
  net_monthly_income?: number;
  monthly_fixed_expenses?: ExpenseItem[] | null;
  monthly_savings_investment?: ExpenseItem[] | null;
}
