import { RowDataPacket } from "mysql2";

export type FinancialChatSender = "USER" | "AI";

export interface FinancialStatementChatMessage extends RowDataPacket{
  id: string;
  financial_statement_chat_room_id: string;
  sender: FinancialChatSender;
  content: string;
  message_index: number;
  created_at: Date;
  updated_at: Date;
}
