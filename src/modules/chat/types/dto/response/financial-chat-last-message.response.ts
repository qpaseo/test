//채팅방이랑 마지막 메시지 같이 보내주는 response DTO
export interface FsChatRoomWithLastMessage {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  lastMessage: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
