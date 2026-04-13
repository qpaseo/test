import { ChatSender } from "../internal";

//db 타입
export interface FinancialStatementChatMessageRow {
  id: string;
  financial_statement_chat_room_id: string;
  sender: string;
  content: string;
  message_index: number;
  created_at: string;
  updated_at: string | null;
}

export interface FinancialStatementChatMessage {
  id: string;
  financialStatementChatRoomId: string;
  sender: ChatSender;
  content: string;
  messageIndex: number;
  createdAt: Date;
  updatedAt: Date | null;
}
