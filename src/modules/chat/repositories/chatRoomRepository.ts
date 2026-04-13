import { Pool } from "pg";
import { CreateChatRoomInput } from "../types/internal";
import { ChatRoomRow } from "../types/entity/chat-room.entity";

export class ChatRoomRepository {
  constructor(private readonly db: Pool) {}

  async findRoomsByUserId(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ rows: ChatRoomRow[]; total: number }> {
    const offset = (page - 1) * pageSize;
    const [countResult, rowsResult] = await Promise.all([
      this.db.query(
        `SELECT COUNT(*)::int AS total FROM chat_rooms WHERE user_id = $1`,
        [userId],
      ),
      this.db.query(
        `SELECT * FROM chat_rooms WHERE user_id = $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3`,
        [userId, pageSize, offset],
      ),
    ]);
    return {
      rows: rowsResult.rows as ChatRoomRow[],
      total: countResult.rows[0].total,
    };
  }

  async findRoomById(roomId: string): Promise<ChatRoomRow | null> {
    const result = await this.db.query(
      `SELECT * FROM chat_rooms WHERE id = $1`,
      [roomId],
    );
    return (result.rows[0] as ChatRoomRow) ?? null;
  }

  async createRoom(input: CreateChatRoomInput): Promise<void> {
    await this.db.query(
      `INSERT INTO chat_rooms (user_id, name, description) VALUES ($1, $2, $3)`,
      [input.userId, input.name, input.description ?? null],
    );
  }

  async deleteRoom(roomId: string): Promise<void> {
    await this.db.query(`DELETE FROM chat_rooms WHERE id = $1`, [roomId]);
  }

  async incrementMemoryCount(roomId: string): Promise<void> {
    await this.db.query(
      `UPDATE chat_rooms SET memory_count = memory_count + 1 WHERE id = $1`,
      [roomId],
    );
  }
}
