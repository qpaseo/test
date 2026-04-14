import { Pool } from "pg";
import { FinancialStatementChatMessageRow } from "../types/entity/financial-chat-message.entity";
import { CreateFsChatMessageInput } from "../types/internal";
import { IFinancialChatMessageRepository } from "../contracts/repositories/financial.chat.message.repository";

export class FinancialChatMessageRepository implements IFinancialChatMessageRepository {
  constructor(private readonly db: Pool) {}

  async findMessagesByRoomId(
    roomId: string,
  ): Promise<FinancialStatementChatMessageRow[]> {
    const result = await this.db.query<FinancialStatementChatMessageRow>(
      `SELECT * FROM financial_statement_chat_messages
       WHERE financial_statement_chat_room_id = $1
       ORDER BY message_index ASC`,
      [roomId],
    );

    return result.rows;
  }

  async getNextMessageIndex(roomId: string): Promise<number> {
    const result = await this.db.query<{ next_index: number }>(
      `SELECT COALESCE(MAX(message_index), -1) + 1 AS next_index
       FROM financial_statement_chat_messages
       WHERE financial_statement_chat_room_id = $1`,
      [roomId],
    );

    return Number(result.rows[0].next_index);
  }

  async createMessage(input: CreateFsChatMessageInput): Promise<void> {
    await this.db.query(
      `INSERT INTO financial_statement_chat_messages
        (financial_statement_chat_room_id, sender, content, message_index)
       VALUES ($1, $2, $3, $4)`,
      [
        input.financialStatementChatRoomId,
        input.sender,
        input.content,
        input.messageIndex,
      ],
    );
  }

  async deleteMessagesByRoomId(roomId: string): Promise<void> {
    await this.db.query(
      `DELETE FROM financial_statement_chat_messages
       WHERE financial_statement_chat_room_id = $1`,
      [roomId],
    );
  }
}
