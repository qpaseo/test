export interface ChatRoom {
  id: string;
  memory_count: number;
  name: string;
  description: string | null;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
