//db 타입
export interface MonthlyFinanceRow {
  id: string;
  user_id: string;
  year: number;
  month: number;
  income: string;
  expense: string;
  created_at: string;
  updated_at: string | null;
}

//서비스에서 변환
export interface MonthlyFinance {
  id: string;
  userId: string;
  year: number;
  month: number;
  income: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date | null;
}
