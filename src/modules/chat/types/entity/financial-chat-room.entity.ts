//db 타입
export interface FinancialStatementChatRoomRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

// JOIN 쿼리 결과 타입
export interface FinancialStatementChatRoomWithLastMessage extends FinancialStatementChatRoomRow {
  last_message: string | null;
}

export interface FinancialStatementChatRoom {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
