import { Response } from "express";
import OpenAI from "openai";
import {
  ChatRoomDetailResponse,
  ChatRoomListResponse,
  ChatRoomsResponse,
} from "../types/dto/response/chat-rooms.response";
import { ChatRoomRepository } from "../repositories/chat.room.repository";
import { ChatMessageRepository } from "../repositories/chat.message.repository";
import { ChatMemoryRepository } from "../repositories/chat.memory.repository";
import {
  toChatRoomWithLastMessageDto,
  toMemoryDto,
  toMemoryEntity,
  toMessageDto,
  toMessageEntity,
  toRoomEntity,
  toRoomSummaryDto,
} from "./mappers/chat.mappers";
import { buildChatSystemPrompt } from "./prompts/chat.prompts";
import { IChatService } from "../contracts/services/chat.service";
import { IChatAIService } from "../contracts/services/chat.ai.service";
import { UpdateChatRoomInput } from "../types/internal";

// ─── Service ─────────────────────────────────────────────

export class ChatService implements IChatService {
  constructor(
    private readonly roomRepo: ChatRoomRepository,
    private readonly messageRepo: ChatMessageRepository,
    private readonly memoryRepo: ChatMemoryRepository,
    private readonly aiService: IChatAIService, // 추가
  ) {}

  async getChatRoomsWithLastMessage(
    userId: string,
  ): Promise<ChatRoomsResponse[]> {
    const rows = await this.roomRepo.findChatRoomsWithLastMessage(userId);

    return rows.map(toChatRoomWithLastMessageDto);
  }

  async getRagChatRooms(userId: string): Promise<ChatRoomsResponse[]> {
    const rows = await this.roomRepo.findChatRoomsWithLastMessage(userId);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      lastMessage: row.last_message,
      createdAt: new Date(row.created_at),
    }));
  }

  async getRoomList(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<ChatRoomListResponse> {
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

  async getRoomDetail(
    roomId: string,
    userId: string,
  ): Promise<ChatRoomDetailResponse> {
    const roomRow = await this.roomRepo.findRoomById(roomId);

    if (!roomRow) throw new Error("채팅방 없음");
    if (roomRow.user_id !== userId) throw new Error("권한이 없습니다.");

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

  async createRoom(userId: string, firstMessage: string): Promise<string> {
    const { name, description } =
      await this.aiService.generateRoomMeta(firstMessage);
    const roomId = await this.roomRepo.createRoom({
      userId,
      name,
      description,
    });
    return roomId;
  }

  async updateRoom(
    roomId: string,
    userId: string,
    input: UpdateChatRoomInput,
  ): Promise<void> {
    const room = await this.roomRepo.findRoomById(roomId);

    if (!room) throw new Error("채팅방 없음");
    if (room.user_id !== userId) throw new Error("권한이 없습니다.");

    await this.roomRepo.updateRoom(roomId, input);
  }

  async deleteRoom(roomId: string, userId: string): Promise<void> {
    const room = await this.roomRepo.findRoomById(roomId);

    if (!room) throw new Error("채팅방 없음");
    if (room.user_id !== userId) throw new Error("권한 없음");

    await Promise.all([
      this.memoryRepo.deleteMemoriesByRoomId(roomId),
      this.messageRepo.deleteMessagesByRoomId(roomId),
    ]);

    await this.roomRepo.deleteRoom(roomId);
  }

  //-----streamChat-----
  //방 조회 / 생성 + 권한 처리
  private async resolveRoom(
    userId: string,
    firstMessage: string,
    roomId?: string,
  ) {
    let room = roomId ? await this.roomRepo.findRoomById(roomId) : null;

    if (!room) {
      const newRoomId = await this.roomRepo.createRoom({
        userId,
        name: firstMessage.slice(0, 50),
      });
      room = await this.roomRepo.findRoomById(newRoomId);
    }

    if (!room || room.user_id !== userId) {
      throw new Error("권한이 없습니다.");
    }

    return room;
  }

  //사용자 메시지 저장
  private async saveUserMessage(roomId: string, userMessage: string) {
    const nextIndex = await this.messageRepo.getNextMessageIndex(roomId);

    await this.messageRepo.createMessage({
      chatRoomId: roomId,
      sender: "USER",
      content: userMessage,
      messageIndex: nextIndex,
    });
  }

  //메시지 컨텍스트 구성
  private async buildMessages(
    roomId: string,
    userMessage: string,
    memoryCount: number,
  ): Promise<OpenAI.Chat.ChatCompletionMessageParam[]> {
    const recentMessages = await this.messageRepo.findRecentMessages(
      roomId,
      19,
    );

    return [
      {
        role: "system",
        content: buildChatSystemPrompt(null, null, memoryCount),
      },
      ...recentMessages.map(
        (m): OpenAI.Chat.ChatCompletionMessageParam => ({
          role: m.sender === "USER" ? "user" : "assistant",
          content: m.content,
        }),
      ),
      { role: "user", content: userMessage },
    ];
  }

  // SSE 세팅
  private prepareSSE(res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
  }

  //AI 응답 저장
  private async saveAIMessage(roomId: string, content: string) {
    const aiIndex = await this.messageRepo.getNextMessageIndex(roomId);

    await this.messageRepo.createMessage({
      chatRoomId: roomId,
      sender: "AI",
      content,
      messageIndex: aiIndex,
    });
  }

  async streamChat(
    userId: string,
    userMessage: string,
    res: Response,
    roomId?: string,
  ): Promise<void> {
    const room = await this.resolveRoom(userId, userMessage, roomId);

    await this.saveUserMessage(room.id, userMessage);

    const messages = await this.buildMessages(
      room.id,
      userMessage,
      room.memory_count,
    );

    this.prepareSSE(res);

    const finalContent = await this.aiService.runToolLoop(
      messages,
      res,
      room.id,
      userId,
    );

    await this.saveAIMessage(room.id, finalContent);

    res.write("data: [DONE]\n\n");
    res.end();
  }
}
