import { getDatabase } from "../../../config/db/db";
import { ChatRoomWithLastMessage } from "../types/entity/chat-room.entity";

export class ChatRoomRepository {
  static async findChatRoomsWithFirstMessage(
    userId: string,
  ): Promise<ChatRoomWithLastMessage[]> {
    const pool = getDatabase();

    const result = await pool.query<ChatRoomWithLastMessage>(
      `
      SELECT 
        r.*,
        m.content AS last_message
      FROM chat_rooms r
      LEFT JOIN chat_messages m
        ON r.id = m.chat_room_id
        AND m.message_index = (
          SELECT MAX(message_index)
          FROM chat_messages
          WHERE chat_room_id = r.id
        )
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      `,
      [userId],
    );

    return result.rows;
  }
}
