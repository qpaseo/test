import { ChatRoomRepository } from "../repositories/chatRepository";
import { GetChatRoomsResponse } from "../types/dto/response/chat-rooms.response";

export class ChatService {
  static async getRagChatRooms(
    userId: string,
  ): Promise<GetChatRoomsResponse[]> {
    const rows = await ChatRoomRepository.findChatRoomsWithFirstMessage(userId);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      lastMessage: row.last_message,
      createdAt: new Date(row.created_at),
    }));
  }
}
