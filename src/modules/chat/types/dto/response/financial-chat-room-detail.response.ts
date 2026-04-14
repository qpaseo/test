import { FsChatMessageResponse } from "./financial-chat-message.response";

export interface FsChatRoomDetailResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  messages: FsChatMessageResponse[];
}
