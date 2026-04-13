import { FinancialChatRoomRepository } from "../repositories/financialChatRepository";
import { FinancialChatRoomsResponse } from "../types/dto/response/financial-chat-rooms.response";

export class FinancialChatService {
  static async getFinancialChatRooms(
    userId: string,
  ): Promise<FinancialChatRoomsResponse | null> {
    const row =
      await FinancialChatRoomRepository.findFinancialChatRoomsWithFirstMessage(
        userId,
      );

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      lastMessage: row.last_message,
      createdAt: new Date(row.created_at),
    };
  }
}
