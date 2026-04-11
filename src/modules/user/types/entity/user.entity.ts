///db 타입
export interface UserRow {
  id: string;
  name: string;
  email: string;
  password: string;
  has_loan: boolean;
  has_stock: boolean;
  recent_plan_date: string | null;
  created_at: string;
  updated_at: string;
}

//서비스에서 변환
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  hasLoan: boolean;
  hasStock: boolean;

  recentPlanDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
