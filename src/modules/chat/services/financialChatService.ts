import { FinancialChatRoomRepository } from "../repositories/financialChatRepository";
import { FinancialChatRoomsResponse } from "../types/dto/response/financial-chat-rooms.response";

export class FinancialChatService {
  static async getFinancialChatRooms(
    userId: string,
  ): Promise<FinancialChatRoomsResponse[]> {
    const rows =
      await FinancialChatRoomRepository.findFinancialChatRoomsWithFirstMessage(
        userId,
      );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      firstMessage: row.first_message,
      createdAt: new Date(row.created_at),
    }));
  }
}
