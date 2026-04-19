import { Pool } from "pg";
import { CreateChatMessageInput } from "../types/internal";
import { ChatMessageRow } from "../types/entity/chat-message.entity";
import { IChatMessageRepository } from "../contracts/repositories/chat.message.repository";

export class ChatMessageRepository implements IChatMessageRepository {
  constructor(private readonly db: Pool) {}

  async findMessagesByRoomId(roomId: string): Promise<ChatMessageRow[]> {
    const result = await this.db.query(
      `SELECT * FROM chat_messages WHERE chat_room_id = $1 ORDER BY message_index ASC`,
      [roomId],
    );
    return result.rows as ChatMessageRow[];
  }

  async findRecentMessages(
    roomId: string,
    limit: number,
  ): Promise<ChatMessageRow[]> {
    const result = await this.db.query(
      `SELECT * FROM (
         SELECT * FROM chat_messages WHERE chat_room_id = $1
         ORDER BY message_index DESC LIMIT $2
       ) sub ORDER BY message_index ASC`,
      [roomId, limit],
    );
    return result.rows as ChatMessageRow[];
  }

  async findMessagesByIndexRange(
    roomId: string,
    startIndex: number,
    endIndex?: number,
  ): Promise<ChatMessageRow[]> {
    if (endIndex === undefined) {
      const result = await this.db.query(
        `SELECT * FROM chat_messages WHERE chat_room_id = $1 AND message_index = $2`,
        [roomId, startIndex],
      );
      return result.rows as ChatMessageRow[];
    }

    const result = await this.db.query(
      `SELECT * FROM chat_messages WHERE chat_room_id = $1
       AND message_index BETWEEN $2 AND $3 ORDER BY message_index ASC`,
      [roomId, startIndex, endIndex],
    );
    return result.rows as ChatMessageRow[];
  }

  async getNextMessageIndex(roomId: string): Promise<number> {
    const result = await this.db.query(
      `SELECT COALESCE(MAX(message_index), -1) + 1 AS next_index
       FROM chat_messages WHERE chat_room_id = $1`,
      [roomId],
    );

    return Number(result.rows[0].next_index);
  }

  async createMessage(input: CreateChatMessageInput): Promise<void> {
    await this.db.query(
      `INSERT INTO chat_messages (chat_room_id, sender, content, message_index)
       VALUES ($1, $2, $3, $4)`,
      [input.chatRoomId, input.sender, input.content, input.messageIndex],
    );
  }

  async deleteMessagesByRoomId(roomId: string): Promise<void> {
    await this.db.query(`DELETE FROM chat_messages WHERE chat_room_id = $1`, [
      roomId,
    ]);
  }
}
