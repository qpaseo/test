import { RowDataPacket } from "mysql2";

///db 타입
export interface UserRow extends RowDataPacket {
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

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  has_loan: boolean;
  has_stock: boolean;

  recent_plan_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
