import { uuidv4 } from "zod";
import { getDatabase } from "../../../config/db/db";

export class FinancialChatRoomRepository {
  static async createFinancialStatementChatRoom(userId: string): Promise<void> {
    const pool = getDatabase();
    const id = uuidv4();
    await pool.query(
      `INSERT INTO financial_statement_chat_rooms (id, user_id, name, description)
     VALUES (?, ?, ?, ?)`,
      [id, userId, "재무설계 채팅", null],
    );
  }
}
