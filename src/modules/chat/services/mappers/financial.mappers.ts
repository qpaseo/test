import { FsChatRoomWithLastMessage } from "../../types/dto/response/financial-chat-last-message.response";
import { FsChatMessageResponse } from "../../types/dto/response/financial-chat-message.response";
import { FsChatRoomSummaryResponse } from "../../types/dto/response/financial-chat-room-summary.response";
import {
  FinancialStatementChatMessage,
  FinancialStatementChatMessageRow,
} from "../../types/entity/financial-chat-message.entity";
import {
  FinancialStatementChatRoom,
  FinancialStatementChatRoomRow,
  FinancialStatementChatRoomWithLastMessage,
} from "../../types/entity/financial-chat-room.entity";
import { ChatSender } from "../../types/internal";

// ─── Row → Entity ─────────────────────────────────

function toRoomEntity(
  row: FinancialStatementChatRoomRow,
): FinancialStatementChatRoom {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

function toMessageEntity(
  row: FinancialStatementChatMessageRow,
): FinancialStatementChatMessage {
  return {
    id: row.id,
    financialStatementChatRoomId: row.financial_statement_chat_room_id,
    sender: row.sender as ChatSender,
    content: row.content,
    messageIndex: row.message_index,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

// ─── Entity → DTO ─────────────────────────────────

function toMessageDto(
  entity: FinancialStatementChatMessage,
): FsChatMessageResponse {
  return {
    id: entity.id,
    financialStatementChatRoomId: entity.financialStatementChatRoomId,
    sender: entity.sender,
    content: entity.content,
    messageIndex: entity.messageIndex,
    createdAt: entity.createdAt,
  };
}

function toRoomSummaryDto(
  entity: FinancialStatementChatRoom,
): FsChatRoomSummaryResponse {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function toFsChatRoomWithLastMessageDto(
  row: FinancialStatementChatRoomWithLastMessage,
): FsChatRoomWithLastMessage {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    lastMessage: row.last_message,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

export {
  toRoomEntity,
  toMessageEntity,
  toMessageDto,
  toRoomSummaryDto,
  toFsChatRoomWithLastMessageDto,
};
