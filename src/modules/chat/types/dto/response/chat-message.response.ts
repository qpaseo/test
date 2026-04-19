import { ChatSender } from "../../internal";

//chat 메세지 응답 DTO
export interface ChatMessageResponse {
  id: string;
  chatRoomId: string;
  sender: ChatSender;
  content: string;
  messageIndex: number;
  createdAt: Date;
}
