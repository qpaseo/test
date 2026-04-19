import { ChatSender } from "../../internal";

export interface FsChatMessageResponse {
  id: string;
  financialStatementChatRoomId: string;
  sender: ChatSender;
  content: string;
  messageIndex: number;
  createdAt: Date;
}
