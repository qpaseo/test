//db 타입
export interface ChatRoomRow {
  id: string;
  memory_count: number;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string | null;
}

// JOIN 쿼리 결과 타입
export interface ChatRoomWithLastMessage extends ChatRoomRow {
  last_message: string | null;
}

export interface ChatRoom {
  id: string;
  memoryCount: number;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}
