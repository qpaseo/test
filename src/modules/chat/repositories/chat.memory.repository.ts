import { Pool } from "pg";
import { CreateChatMemoryInput } from "../types/internal";
import { ChatMemoryRow } from "../types/entity/chat-memory.entity";
import { IChatMemoryRepository } from "../contracts/repositories/chat.memory.repository";

export class ChatMemoryRepository implements IChatMemoryRepository {
  constructor(private readonly db: Pool) {}

  async findMemoriesByRoomId(roomId: string): Promise<ChatMemoryRow[]> {
    const result = await this.db.query(
      `SELECT * FROM chat_memories WHERE chat_room_id = $1 ORDER BY start_index ASC`,
      [roomId],
    );
    return result.rows as ChatMemoryRow[];
  }

  async findLatestMemory(roomId: string): Promise<ChatMemoryRow | null> {
    const result = await this.db.query(
      `SELECT * FROM chat_memories WHERE chat_room_id = $1
       ORDER BY end_index DESC LIMIT 1`,
      [roomId],
    );
    return (result.rows[0] as ChatMemoryRow) ?? null;
  }

  async findMemoryById(memoryId: string): Promise<ChatMemoryRow | null> {
    const result = await this.db.query(
      `SELECT * FROM chat_memories WHERE id = $1`,
      [memoryId],
    );
    return (result.rows[0] as ChatMemoryRow) ?? null;
  }

  async createMemory(input: CreateChatMemoryInput): Promise<void> {
    await this.db.query(
      `INSERT INTO chat_memories (chat_room_id, content, start_index, end_index)
       VALUES ($1, $2, $3, $4)`,
      [input.chatRoomId, input.content, input.startIndex, input.endIndex],
    );
  }

  async deleteMemoriesByRoomId(roomId: string): Promise<void> {
    await this.db.query(`DELETE FROM chat_memories WHERE chat_room_id = $1`, [
      roomId,
    ]);
  }
}
