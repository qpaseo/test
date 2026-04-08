export type ChatSender = "USER" | "AI";

export interface ChatMessage {
  id: string;
  chat_room_id: string;
  sender: ChatSender;
  content: string;
  message_index: number;
  created_at: Date;
  updated_at: Date;
}
