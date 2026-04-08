export interface FinancialStatementChatRoom {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}
