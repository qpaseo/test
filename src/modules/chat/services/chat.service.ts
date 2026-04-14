import { Response } from "express";
import OpenAI from "openai";
import {
  ChatRoomDetailResponse,
  ChatRoomListResponse,
  ChatRoomsResponse,
} from "../types/dto/response/chat-rooms.response";
import { CHAT_TOOLS, ChatToolHandler } from "../tools/chat.tools";
import { ChatRoomRepository } from "../repositories/chat.room.repository";
import { ChatMessageRepository } from "../repositories/chat.message.repository";
import { ChatMemoryRepository } from "../repositories/chat.memory.repository";
import { IOpenAIClient } from "../../../infrastructure/ai/contracts/openai-client";
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

// ─── Service ─────────────────────────────────────────────

export class ChatService implements IChatService {
  constructor(
    private readonly roomRepo: ChatRoomRepository,
    private readonly messageRepo: ChatMessageRepository,
    private readonly memoryRepo: ChatMemoryRepository,
    //private readonly toolRepo: ChatToolRepository,
    private readonly toolHandler: ChatToolHandler,
    private readonly openaiClient: IOpenAIClient,
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

  async streamChat(
    roomId: string,
    userId: string,
    userMessage: string,
    res: Response,
  ): Promise<void> {
    let room = await this.roomRepo.findRoomById(roomId);

    if (!room) {
      await this.roomRepo.createRoom({
        userId,
        name: userMessage.slice(0, 50),
      });
      room = await this.roomRepo.findRoomById(roomId);
    }

    if (!room || room.user_id !== userId) {
      throw new Error("권한이 없습니다.");
    }

    const nextIndex = await this.messageRepo.getNextMessageIndex(roomId);

    await this.messageRepo.createMessage({
      chatRoomId: roomId,
      sender: "USER",
      content: userMessage,
      messageIndex: nextIndex,
    });

    // B안: latestMemory, userMemory 사전 조회 제거
    const recentMessages = await this.messageRepo.findRecentMessages(
      roomId,
      19,
    );

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        // 시스템 프롬프트 간소화 - memory/userMemory는 tool로 위임
        content: buildChatSystemPrompt(null, null, room.memory_count),
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

    const finalContent = await this.runToolLoop(
      messages,
      res,
      roomId, // tool에 chat_room_id 넘기기 위해 추가
      userId,
    );

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
    roomId: string,
    userId: string,
  ): Promise<string> {
    let final = "";

    while (true) {
      const response = await this.openaiClient.createChatCompletion({
        messages,
        tools: CHAT_TOOLS,
        tool_choice: "auto",
      });

      const choice = response.choices[0];

      if (choice.finish_reason === "tool_calls") {
        messages.push(choice.message);

        for (const call of choice.message.tool_calls ?? []) {
          if (call.type !== "function") continue;

          const args = JSON.parse(call.function.arguments);

          // chat_room_id, user_id는 AI가 모르므로 서버에서 주입
          if ("chat_room_id" in args) args.chat_room_id = roomId;
          if ("user_id" in args) args.user_id = userId;

          const result = await this.toolHandler.handle(
            call.function.name,
            args,
          );

          messages.push({
            role: "tool",
            tool_call_id: call.id,
            content: result,
          });
        }
        continue;
      }

      const stream = await this.openaiClient.createChatStream(messages);

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content ?? "";

        if (delta) {
          final += delta;
          res.write(`data: ${JSON.stringify({ chunk: delta })}\n\n`);
        }
      }
      break;
    }

    return final;
  }
}
