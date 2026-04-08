export interface FinancialGoal {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_amount: string; // DECIMAL
  current_amount: string;
  monthly_contribution: string;
  start_date: string | null; // DATE
  end_date: string | null; // DATE
  created_at: Date;
  updated_at: Date;
}
