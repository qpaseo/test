import { FinancialStatementChatMessageRow } from "../../types/entity/financial-chat-message.entity";
import { CreateFsChatMessageInput } from "../../types/internal";

export interface IFinancialChatMessageRepository {
  findMessagesByRoomId(
    roomId: string,
  ): Promise<FinancialStatementChatMessageRow[]>;

  getNextMessageIndex(roomId: string): Promise<number>;

  createMessage(input: CreateFsChatMessageInput): Promise<void>;

  deleteMessagesByRoomId(roomId: string): Promise<void>;
}
