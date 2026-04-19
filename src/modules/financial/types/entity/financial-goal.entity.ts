//db 타입
export interface FinancialGoalRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_amount: string; // DECIMAL
  current_amount: string;
  monthly_contribution: string;
  start_date: string | null; // DATE
  end_date: string | null; // DATE
  created_at: string;
  updated_at: string;
}

export interface FinancialGoalWithProgressRow extends FinancialGoalRow {
  progress_percentage: string; // numeric → string으로 내려옴
}

//서비스에서 변환
export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface FinancialGoalWithProgress extends FinancialGoal {
  progressPercentage: number;
}
