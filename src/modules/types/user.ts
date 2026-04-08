export interface User {
  id: string;
  name: string;
  password: string;
  has_loan: boolean;
  has_stock: boolean;
  recent_plan_date: string | null; // DATE
  created_at: Date;
  updated_at: Date;
}
