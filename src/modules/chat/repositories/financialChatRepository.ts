//재무설계 표 관련 채팅

import { uuidv4 } from "zod";
import { getDatabase } from "../../../config/db/db";
import { FinancialStatementChatRoomRow } from "../types/financialStatementChatRoom";

export class FinancialChatRoomRepository {
  /**
   * 재무설계 표 채팅방 생성 (유저 회원가입시에 사용)
   **/
  static async createFinancialStatementChatRoom(userId: string): Promise<void> {
    const pool = getDatabase();
    const id = uuidv4();
    await pool.query(
      `INSERT INTO financial_statement_chat_rooms (id, user_id, name, description)
     VALUES (?, ?, ?, ?)`,
      [id, userId, "재무설계 채팅", null],
    );
  }

  /**
   * 재무설계 표 채팅방 조회 + 첫 메세지
   */
  static async findFinancialChatRoomsWithFirstMessage(
    userId: string,
  ): Promise<FinancialStatementChatRoomRow[]> {
    const pool = getDatabase();

    const [rows] = await pool.query<any[]>(
      `
    SELECT 
      r.*,
      m.content AS first_message
    FROM financial_statement_chat_rooms r
    LEFT JOIN financial_statement_chat_messages m
      ON r.id = m.financial_statement_chat_room_id
      AND m.message_index = 0
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
    `,
      [userId],
    );

    return rows[0];
  }
}
