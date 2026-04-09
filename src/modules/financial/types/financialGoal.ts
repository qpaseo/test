import { RowDataPacket } from "mysql2";

//db 타입
export interface FinancialGoalRow extends RowDataPacket {
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
