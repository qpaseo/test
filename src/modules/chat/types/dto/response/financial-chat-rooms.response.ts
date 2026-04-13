export interface FsChatRoomsResponse {
  id: string;
  name: string;
  description: string | null;
  lastMessage: string | null;
  createdAt: Date;
}
