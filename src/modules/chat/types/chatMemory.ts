import { RowDataPacket } from "mysql2/promise";

export interface ChatMemory extends RowDataPacket {
  id: string;
  chat_room_id: string;
  content: string;
  start_index: number;
  end_index: number;
  created_at: Date;
  updated_at: Date;
}
