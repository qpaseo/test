export interface ChatMemoryRow {
  id: string;
  chat_room_id: string;
  content: string;
  start_index: number;
  end_index: number;
  created_at: string;
  updated_at: string | null;
}

export interface ChatMemory {
  id: string;
  chatRoomId: string;
  content: string;
  startIndex: number;
  endIndex: number;
  createdAt: Date;
  updatedAt: Date | null;
}
