import { Pool } from "pg";
import {
  FinancialStatementChatRoomRow,
  FinancialStatementChatRoomWithLastMessage,
} from "../types/entity/financial-chat-room.entity";
import { CreateFsChatRoomInput } from "../types/internal";
import { IFinancialChatRoomRepository } from "../contracts/repositories/financial.chat.room.repository";

export class FinancialChatRoomRepository implements IFinancialChatRoomRepository {
  constructor(private readonly db: Pool) {}

  async createFinancialStatementChatRoom(userId: string): Promise<void> {
    await this.db.query(
      `
      INSERT INTO financial_statement_chat_rooms (user_id, name, description)
      VALUES ($1, $2, $3)
      `,
      [userId, "재무설계 채팅", null],
    );
  }

  async findFinancialChatRoomsWithLastMessage(
    userId: string,
  ): Promise<FinancialStatementChatRoomWithLastMessage[]> {
    const { rows } = await this.db.query<
      FinancialStatementChatRoomRow & { last_message: string | null }
    >(
      `
      SELECT 
        r.*,
        m.content AS last_message
      FROM financial_statement_chat_rooms r
      LEFT JOIN LATERAL (
        SELECT content
        FROM financial_statement_chat_messages m
        WHERE m.financial_statement_chat_room_id = r.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) m ON true
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC;
      `,
      [userId],
    );

    return rows as FinancialStatementChatRoomWithLastMessage[];
  }

  async findRoomsByUserId(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ rows: FinancialStatementChatRoomRow[]; total: number }> {
    const offset = (page - 1) * pageSize;

    const [countResult, rowsResult] = await Promise.all([
      this.db.query<{ total: number }>(
        `SELECT COUNT(*)::int AS total FROM financial_statement_chat_rooms WHERE user_id = $1`,
        [userId],
      ),
      this.db.query<FinancialStatementChatRoomRow>(
        `SELECT * FROM financial_statement_chat_rooms WHERE user_id = $1
         ORDER BY updated_at DESC LIMIT $2 OFFSET $3`,
        [userId, pageSize, offset],
      ),
    ]);

    return {
      rows: rowsResult.rows,
      total: countResult.rows[0].total,
    };
  }

  async findRoomById(
    roomId: string,
  ): Promise<FinancialStatementChatRoomRow | null> {
    const result = await this.db.query<FinancialStatementChatRoomRow>(
      `SELECT * FROM financial_statement_chat_rooms WHERE id = $1`,
      [roomId],
    );

    return result.rows[0] ?? null;
  }

  async createRoom(input: CreateFsChatRoomInput): Promise<void> {
    await this.db.query(
      `INSERT INTO financial_statement_chat_rooms (user_id, name, description)
       VALUES ($1, $2, $3)`,
      [input.userId, input.name, input.description ?? null],
    );
  }
}
