import { ChatSender } from "../internal";


export interface ChatMessageRow  {
  id: string;
  chat_room_id: string;
  sender: string;
  content: string;
  message_index: number;
  created_at: string;
  updated_at: string | null;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  sender: ChatSender;
  content: string;
  messageIndex: number;
  createdAt: Date;
  updatedAt: Date | null;
}
