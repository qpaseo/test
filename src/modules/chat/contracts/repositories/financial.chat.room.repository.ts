import {
  FinancialStatementChatRoomRow,
  FinancialStatementChatRoomWithLastMessage,
} from "../../types/entity/financial-chat-room.entity";
import { CreateFsChatRoomInput } from "../../types/internal";

export interface IFinancialChatRoomRepository {
  createFinancialStatementChatRoom(userId: string): Promise<void>;

  findFinancialChatRoomsWithLastMessage(
    userId: string,
  ): Promise<FinancialStatementChatRoomWithLastMessage[]>;

  // findRoomsByUserId(
  //   userId: string,
  //   page: number,
  //   pageSize: number,
  // ): Promise<{ rows: FinancialStatementChatRoomRow[]; total: number }>;

  findRoomById(roomId: string): Promise<FinancialStatementChatRoomRow | null>;

  createRoom(input: CreateFsChatRoomInput): Promise<void>;

  updateRoom(
    roomId: string,
    input: { name?: string; description?: string | null },
  ): Promise<void>;
}
