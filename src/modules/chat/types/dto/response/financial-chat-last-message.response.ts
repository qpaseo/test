//채팅방이랑 마지막 메시지 같이 보내주는 response DTO
export interface FsChatRoomWithLastMessage {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  last_message: string | null;
  created_at: string;
  updated_at: string | null;
}
