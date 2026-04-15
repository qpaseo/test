import { Pool } from "pg";
import { CreateChatRoomInput, UpdateChatRoomInput } from "../types/internal";
import {
  ChatRoomRow,
  ChatRoomWithLastMessage,
} from "../types/entity/chat-room.entity";
import { IChatRoomRepository } from "../contracts/repositories/chat.room.repository";
import { IIdGenerator } from "../../../common/utils/contracts/uuid.generator.util";

export class ChatRoomRepository implements IChatRoomRepository {
  constructor(
    private readonly db: Pool,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async findChatRoomsWithLastMessage(
    userId: string,
  ): Promise<ChatRoomWithLastMessage[]> {
    const { rows } = await this.db.query(
      `
        SELECT 
          r.*,
          m.content AS last_message
        FROM chat_rooms r
        LEFT JOIN LATERAL (
          SELECT content
          FROM chat_messages m
          WHERE m.chat_room_id = r.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) m ON true
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC;
      `,
      [userId],
    );

    return rows as ChatRoomWithLastMessage[];
  }

  async findRoomsByUserId(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ rows: ChatRoomRow[]; total: number }> {
    const offset = (page - 1) * pageSize;

    const [countResult, rowsResult] = await Promise.all([
      this.db.query<{ total: number }>(
        `SELECT COUNT(*)::int AS total FROM chat_rooms WHERE user_id = $1`,
        [userId],
      ),
      this.db.query<ChatRoomRow>(
        `SELECT * FROM chat_rooms WHERE user_id = $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3`,
        [userId, pageSize, offset],
      ),
    ]);

    return {
      rows: rowsResult.rows,
      total: countResult.rows[0].total,
    };
  }

  async findRoomById(roomId: string): Promise<ChatRoomRow | null> {
    const result = await this.db.query<ChatRoomRow>(
      `SELECT * FROM chat_rooms WHERE id = $1`,
      [roomId],
    );

    return result.rows[0] ?? null;
  }

  async createRoom(input: CreateChatRoomInput): Promise<string> {
    const id = this.idGenerator.generate();

    await this.db.query(
      `INSERT INTO chat_rooms (id, user_id, name, description) VALUES ($1, $2, $3, $4)`,
      [id, input.userId, input.name, input.description ?? null],
    );

    return id;
  }

  async updateRoom(roomId: string, input: UpdateChatRoomInput): Promise<void> {
    await this.db.query(
      `UPDATE chat_rooms 
     SET 
       name = COALESCE($1, name), 
       description = COALESCE($2, description),
       updated_at = NOW()
     WHERE id = $3`,
      [input.name ?? null, input.description ?? null, roomId],
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
