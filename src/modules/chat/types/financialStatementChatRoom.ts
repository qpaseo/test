import { RowDataPacket } from "mysql2";

//(db 타입)
export interface FinancialStatementChatRoomRow extends RowDataPacket {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface FinancialStatementChatRoom {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
