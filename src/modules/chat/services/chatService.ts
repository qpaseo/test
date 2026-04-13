import { Response } from "express";
import { Pool } from "pg";
import OpenAI from "openai";
import { ChatRoom, ChatRoomRow } from "../types/entity/chat-room.entity";
import {
  ChatMessage,
  ChatMessageRow,
} from "../types/entity/chat-message.entity";
import { ChatMemory, ChatMemoryRow } from "../types/entity/chat-memory.entity";
import {
  UserMemory,
  UserMemoryRow,
} from "../../user/types/entity/user-memory.entity";
import { ChatMessageResponse } from "../types/dto/response/chat-message.response";
import { ChatMemoryResponse } from "../types/dto/response/chat-memory.response";
import { ChatRoomSummaryResponse } from "../types/dto/response/chat-rooms.response";
import { ChatToolHandler } from "../tools/chatTools";
import { ChatToolRepository } from "../repositories/chatToolRepository";
import { ChatSender } from "../types/internal";
import { ChatRoomRepository } from "../repositories/chatRoomRepository";
import { ChatMessageRepository } from "../repositories/chatMessageRepository";
import { ChatMemoryRepository } from "../repositories/chatMemoryRepository";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//const MEMORY_TRIGGER_COUNT = 20;

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
    createdAt: entity.createdAt.toISOString(),
  };
}

function toMemoryDto(entity: ChatMemory): ChatMemoryResponse {
  return {
    id: entity.id,
    content: entity.content,
    startIndex: entity.startIndex,
    endIndex: entity.endIndex,
    createdAt: entity.createdAt.toISOString(),
  };
}

function toRoomSummaryDto(entity: ChatRoom): ChatRoomSummaryResponse {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    memoryCount: entity.memoryCount,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt ? entity.updatedAt.toISOString() : null,
  };
}

// ─── Service ─────────────────────────────────────────────

export class ChatService {
  private roomRepo: ChatRoomRepository;
  private messageRepo: ChatMessageRepository;
  private memoryRepo: ChatMemoryRepository;
  private toolRepo: ChatToolRepository;
  private toolHandler: ChatToolHandler;

  constructor(private readonly db: Pool) {
    this.roomRepo = new ChatRoomRepository(db);
    this.messageRepo = new ChatMessageRepository(db);
    this.memoryRepo = new ChatMemoryRepository(db);
    this.toolRepo = new ChatToolRepository(db);
    this.toolHandler = new ChatToolHandler(db);
  }

  async getRagChatRooms(userId: string) {
    const rows = await this.roomRepo.findChatRoomsWithLastMessage(userId);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      lastMessage: row.last_message,
      createdAt: new Date(row.created_at),
    }));
  }

  async getRoomList(userId: string, page: number, pageSize: number) {
    const { rows, total } = await this.roomRepo.findRoomsByUserId(
      userId,
      page,
      pageSize,
    );

    return {
      rooms: rows.map((r) => toRoomSummaryDto(toRoomEntity(r))),
      total,
      page,
      pageSize,
    };
  }

  async getRoomDetail(roomId: string, userId: string) {
    const roomRow = await this.roomRepo.findRoomById(roomId);

    if (!roomRow) throw new Error("채팅방 없음");
    if (roomRow.user_id !== userId) throw new Error("권한 없음");

    const [messages, memories] = await Promise.all([
      this.messageRepo.findMessagesByRoomId(roomId),
      this.memoryRepo.findMemoriesByRoomId(roomId),
    ]);

    return {
      ...toRoomSummaryDto(toRoomEntity(roomRow)),
      messages: messages.map((m) => toMessageDto(toMessageEntity(m))),
      memories: memories.map((m) => toMemoryDto(toMemoryEntity(m))),
    };
  }

  async deleteRoom(roomId: string, userId: string) {
    const room = await this.roomRepo.findRoomById(roomId);

    if (!room) throw new Error("채팅방 없음");
    if (room.user_id !== userId) throw new Error("권한 없음");

    await Promise.all([
      this.memoryRepo.deleteMemoriesByRoomId(roomId),
      this.messageRepo.deleteMessagesByRoomId(roomId),
    ]);

    await this.roomRepo.deleteRoom(roomId);
  }

  async streamChat(
    roomId: string,
    userId: string,
    userMessage: string,
    res: Response,
  ) {
    let room = await this.roomRepo.findRoomById(roomId);

    if (!room) {
      await this.roomRepo.createRoom({
        userId,
        name: userMessage.slice(0, 50),
      });
      room = await this.roomRepo.findRoomById(roomId);
    }

    if (room == null || room.user_id !== userId) {
      throw new Error("권한 없음");
    }

    const nextIndex = await this.messageRepo.getNextMessageIndex(roomId);

    await this.messageRepo.createMessage({
      chatRoomId: roomId,
      sender: "USER",
      content: userMessage,
      messageIndex: nextIndex,
    });

    const [latestMemory, recentMessages, userMemory] = await Promise.all([
      this.memoryRepo.findLatestMemory(roomId),
      this.messageRepo.findRecentMessages(roomId, 19),
      this.toolRepo.findUserMemoryByUserId(userId),
    ]);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: buildChatSystemPrompt(
          latestMemory ? toMemoryEntity(latestMemory) : null,
          userMemory ? toUserMemoryEntity(userMemory) : null,
          room.memory_count,
        ),
      },
      ...recentMessages.map(
        (m): OpenAI.Chat.ChatCompletionMessageParam => ({
          role: m.sender === "USER" ? "user" : "assistant",
          content: m.content,
        }),
      ),
      {
        role: "user",
        content: userMessage,
      },
    ];

    res.setHeader("Content-Type", "text/event-stream");

    const finalContent = await this.runToolLoop(messages, res);

    const aiIndex = await this.messageRepo.getNextMessageIndex(roomId);

    await this.messageRepo.createMessage({
      chatRoomId: roomId,
      sender: "AI",
      content: finalContent,
      messageIndex: aiIndex,
    });

    res.write("data: [DONE]\n\n");
    res.end();
  }

  private async runToolLoop(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    res: Response,
  ) {
    let final = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        final += delta;
        res.write(`data: ${JSON.stringify({ chunk: delta })}\n\n`);
      }
    }

    return final;
  }
}

// ─── Prompt ─────────────────────────────────────────────

function buildChatSystemPrompt(
  latestMemory: ChatMemory | null,
  userMemory: UserMemory | null,
  memoryCount: number,
) {
  let prompt = `경제 AI\n메모리 수: ${memoryCount}\n`;

  if (latestMemory) {
    prompt += `\n${latestMemory.content}`;
  }

  if (userMemory) {
    prompt += `\n${userMemory.content.memory}\n중요 정보:\n${userMemory.content.important_information}`;
  }

  return prompt;
}
