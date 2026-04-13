import { FsChatMessageResponse } from "./financial-chat-message.response";

export interface FsChatRoomDetailResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  messages: FsChatMessageResponse[];
}
