import { ChatMessageRow } from "../types/entity/chat-message.entity";
import { CreateChatMessageInput } from "../types/internal";

export interface IChatMessageRepository {
  findMessagesByRoomId(roomId: string): Promise<ChatMessageRow[]>;
  findRecentMessages(roomId: string, limit: number): Promise<ChatMessageRow[]>;
  findMessagesByIndexRange(
    roomId: string,
    startIndex: number,
    endIndex?: number,
  ): Promise<ChatMessageRow[]>;
  getNextMessageIndex(roomId: string): Promise<number>;
  createMessage(input: CreateChatMessageInput): Promise<void>;
  deleteMessagesByRoomId(roomId: string): Promise<void>;
}
