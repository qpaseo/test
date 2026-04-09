//일반 채팅 관련된 래포
import { getDatabase } from "../../../config/db/db";
import { ChatRoomRow } from "../types/chatRoom";

export class ChatRoomRepository {
  /**
   * 일반 채팅방 조회 + 첫 메세지
   * @param userId
   * @returns
   */
  static async findChatRoomsWithFirstMessage(
    userId: string,
  ): Promise<ChatRoomRow[]> {
    const pool = getDatabase();

    const [rows] = await pool.query<any[]>(
      `
    SELECT 
      r.*,
      m.content AS first_message
    FROM chat_rooms r
    LEFT JOIN chat_messages m
      ON r.id = m.chat_room_id
      AND m.message_index = 0
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
    `,
      [userId],
    );

    return rows;
  }
}
