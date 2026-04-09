import { RowDataPacket } from "mysql2";

export interface ChatRoomRow extends RowDataPacket {
  id: string;
  memory_count: number;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  memoryCount: number;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
