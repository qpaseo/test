import {
  UserMemory,
  UserMemoryRow,
} from "../../../user/types/entity/user-memory.entity";
import { ChatMemoryResponse } from "../../types/dto/response/chat-memory.response";
import { ChatMessageResponse } from "../../types/dto/response/chat-message.response";
import {
  ChatRoomSummaryResponse,
  ChatRoomsResponse,
} from "../../types/dto/response/chat-rooms.response";
import {
  ChatMemory,
  ChatMemoryRow,
} from "../../types/entity/chat-memory.entity";
import {
  ChatMessage,
  ChatMessageRow,
} from "../../types/entity/chat-message.entity";
import {
  ChatRoom,
  ChatRoomRow,
  ChatRoomWithLastMessage,
} from "../../types/entity/chat-room.entity";
import { ChatSender } from "../../types/internal";

// ─── Row → Entity ─────────────────────────────────────────

function toRoomEntity(row: ChatRoomRow): ChatRoom {
  return {
    id: row.id,
    memoryCount: row.memory_count,
    name: row.name,
    description: row.description,
    userId: row.user_id,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

function toMessageEntity(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    chatRoomId: row.chat_room_id,
    sender: row.sender as ChatSender,
    content: row.content,
    messageIndex: row.message_index,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

function toMemoryEntity(row: ChatMemoryRow): ChatMemory {
  return {
    id: row.id,
    chatRoomId: row.chat_room_id,
    content: row.content,
    startIndex: row.start_index,
    endIndex: row.end_index,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

function toUserMemoryEntity(row: UserMemoryRow): UserMemory {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content, // JSONB라면 그대로 사용
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

// ─── DTO 변환 ─────────────────────────────────────────────

function toMessageDto(entity: ChatMessage): ChatMessageResponse {
  return {
    id: entity.id,
    chatRoomId: entity.chatRoomId,
    sender: entity.sender,
    content: entity.content,
    messageIndex: entity.messageIndex,
    createdAt: entity.createdAt,
  };
}

function toMemoryDto(entity: ChatMemory): ChatMemoryResponse {
  return {
    id: entity.id,
    content: entity.content,
    startIndex: entity.startIndex,
    endIndex: entity.endIndex,
    createdAt: entity.createdAt,
  };
}

function toRoomSummaryDto(entity: ChatRoom): ChatRoomSummaryResponse {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    memoryCount: entity.memoryCount,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function toChatRoomWithLastMessageDto(
  row: ChatRoomWithLastMessage,
): ChatRoomsResponse {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    lastMessage: row.last_message,
    createdAt: new Date(row.created_at),
  };
}

export {
  toRoomEntity,
  toMessageEntity,
  toMemoryEntity,
  toUserMemoryEntity,
  toMessageDto,
  toMemoryDto,
  toRoomSummaryDto,
  toChatRoomWithLastMessageDto,
};
