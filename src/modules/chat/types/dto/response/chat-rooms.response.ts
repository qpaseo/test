export interface GetChatRoomsResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
