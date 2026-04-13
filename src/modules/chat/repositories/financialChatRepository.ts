// 재무설계 표 관련 채팅
import { getDatabase } from "../../../config/db/db";
import { FinancialStatementChatRoomWithLastMessage } from "../types/entity/financial-chat-room.entity";

export class FinancialChatRoomRepository {
  /**
   * 재무설계 표 채팅방 생성 (유저 회원가입시에 사용)
   **/
  static async createFinancialStatementChatRoom(userId: string): Promise<void> {
    const pool = getDatabase();

    await pool.query(
      `INSERT INTO financial_statement_chat_rooms (id, user_id, name, description)
       VALUES (gen_random_uuid(), $1, $2, $3)`,
      [userId, "재무설계 채팅", null],
    );
  }

  /**
   * 재무설계 표 채팅방 조회 + 첫 메세지
   */
  static async findFinancialChatRoomsWithFirstMessage(
    userId: string,
  ): Promise<FinancialStatementChatRoomWithLastMessage | null> {
    const pool = getDatabase();

    const result = await pool.query<FinancialStatementChatRoomWithLastMessage>(
      `
      SELECT 
        r.*,
        m.content AS first_message
      FROM financial_statement_chat_rooms r
      LEFT JOIN financial_statement_chat_messages m
        ON r.id = m.financial_statement_chat_room_id
        AND m.message_index = 0
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      `,
      [userId],
    );

    return result.rows[0] ?? null;
  }
}
