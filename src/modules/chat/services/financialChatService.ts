import { Response } from "express";
import { Pool } from "pg";
import OpenAI from "openai";
import { ChatToolRepository } from "../../chat/repositories/chatToolRepository";
import { FsChatToolHandler, FS_CHAT_TOOLS } from "../tools/fsChatTools";
import {
  FinancialStatementChatRoom,
  FinancialStatementChatRoomRow,
} from "../types/entity/financial-chat-room.entity";
import {
  FinancialStatementChatMessage,
  FinancialStatementChatMessageRow,
} from "../types/entity/financial-chat-message.entity";
import { FsChatRoomSummaryResponse } from "../types/dto/response/financial-chat-room-summary.response";
import { FsChatRoomListResponse } from "../types/dto/response/financial-chat-room-list.response";
import { FsChatRoomDetailResponse } from "../types/dto/response/financial-chat-room-detail.response";
import { FsChatCompleteResponse } from "../types/dto/response/financial-chat-complete.response";
import { FsChatMessageResponse } from "../types/dto/response/financial-chat-message.response";
import { ChatSender } from "../types/internal";
import { FinancialChatMessageRepository } from "../repositories/financialChatMessageRepository";
import { FinancialChatRoomRepository } from "../repositories/financialChatRoomRepository";
import { FsChatRoomWithLastMessage } from "../types/dto/response/financial-chat-last-message.response";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    createdAt: entity.createdAt.toISOString(),
  };
}

function toRoomSummaryDto(
  entity: FinancialStatementChatRoom,
): FsChatRoomSummaryResponse {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt ? entity.updatedAt.toISOString() : null,
  };
}

// ─── Service ─────────────────────────────────────

export class FsChatService {
  private fsMessageRepo: FinancialChatMessageRepository;
  private fsRoomRepo: FinancialChatRoomRepository;
  private toolRepo: ChatToolRepository;
  private toolHandler: FsChatToolHandler;

  constructor(private readonly db: Pool) {
    this.fsMessageRepo = new FinancialChatMessageRepository(db);
    this.fsRoomRepo = new FinancialChatRoomRepository(db);
    this.toolRepo = new ChatToolRepository(db);
    this.toolHandler = new FsChatToolHandler(db);
  }

  async getFinancialChatRoomsWithLastMessage(
    userId: string,
  ): Promise<FsChatRoomWithLastMessage[]> {
    return this.fsRoomRepo.findFinancialChatRoomsWithLastMessage(userId);
  }

  async getRoomList(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<FsChatRoomListResponse> {
    const { rows, total } = await this.fsRoomRepo.findRoomsByUserId(
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
  ): Promise<FsChatRoomDetailResponse> {
    const roomRow = await this.fsRoomRepo.findRoomById(roomId);
    if (!roomRow) throw new Error("채팅방을 찾을 수 없습니다.");
    if (roomRow.user_id !== userId) throw new Error("접근 권한이 없습니다.");

    const messages = await this.fsMessageRepo.findMessagesByRoomId(roomId);

    return {
      id: roomRow.id,
      name: roomRow.name,
      description: roomRow.description,
      createdAt: new Date(roomRow.created_at).toISOString(),
      updatedAt: roomRow.updated_at
        ? new Date(roomRow.updated_at).toISOString()
        : null,
      messages: messages.map((m) => toMessageDto(toMessageEntity(m))),
    };
  }

  async streamChat(
    roomId: string,
    userId: string,
    userMessage: string,
    res: Response,
  ): Promise<void> {
    let roomRow = await this.fsRoomRepo.findRoomById(roomId);

    if (!roomRow) {
      await this.fsRoomRepo.createRoom({
        userId,
        name: userMessage.slice(0, 50),
      });
      roomRow = await this.fsRoomRepo.findRoomById(roomId);
    }

    if (!roomRow || roomRow.user_id !== userId) {
      throw new Error("채팅방 접근 권한이 없습니다.");
    }

    const nextIndex = await this.fsMessageRepo.getNextMessageIndex(roomId);

    await this.fsMessageRepo.createMessage({
      financialStatementChatRoomId: roomId,
      sender: "USER",
      content: userMessage,
      messageIndex: nextIndex,
    });

    const allMessages = await this.fsMessageRepo.findMessagesByRoomId(roomId);
    const latestStatement =
      await this.toolRepo.findLatestStatementByUserId(userId);

    const systemPrompt = buildFsChatSystemPrompt(latestStatement);

    const messages = [
      { role: "system", content: systemPrompt },
      ...allMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let finalContent = "";

    try {
      finalContent = await this.runToolLoop(messages, res);
    } catch {
      res.write(`data: ${JSON.stringify({ error: "AI 오류" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    const aiIndex = await this.fsMessageRepo.getNextMessageIndex(roomId);

    await this.fsMessageRepo.createMessage({
      financialStatementChatRoomId: roomId,
      sender: "AI",
      content: finalContent,
      messageIndex: aiIndex,
    });

    res.write("data: [DONE]\n\n");
    res.end();
  }

  private async runToolLoop(messages: any[], res: Response): Promise<string> {
    let final = "";

    while (true) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        tools: FS_CHAT_TOOLS,
        tool_choice: "auto",
      });

      const choice = response.choices[0];

      if (choice.finish_reason === "tool_calls") {
        messages.push(choice.message);

        for (const call of choice.message.tool_calls ?? []) {
          if (call.type !== "function") continue;

          const result = await this.toolHandler.handle(
            call.function.name,
            JSON.parse(call.function.arguments),
          );

          messages.push({
            role: "tool",
            tool_call_id: call.id,
            content: result,
          });
        }
        continue;
      }

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          final += delta;
          res.write(
            `event: message\ndata: ${JSON.stringify({ chunk: delta })}\n\n`,
          );
        }
      }

      break;
    }

    return final;
  }

  async completeAndCreateStatement(
    roomId: string,
    userId: string,
  ): Promise<FsChatCompleteResponse> {
    const messages = await this.fsMessageRepo.findMessagesByRoomId(roomId);
    if (!messages.length) throw new Error("대화 없음");

    const text = messages.map((m) => `[${m.sender}] ${m.content}`).join("\n");

    const ai = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "재무재표 JSON 생성" },
        { role: "user", content: text },
      ],
    });

    const parsed = JSON.parse(
      ai.choices[0].message.content!.replace(/```json|```/g, "").trim(),
    );

    await this.toolRepo.deleteOldestStatementIfExceedsLimit(userId);

    await this.toolRepo.createStatement({
      userId,
      ...parsed,
    });

    await this.fsMessageRepo.deleteMessagesByRoomId(roomId);

    const stmt = await this.toolRepo.findLatestStatementByUserId(userId);

    return {
      statement: {
        id: stmt!.id,
        netMonthlyIncome: Number(stmt!.net_monthly_income),
        monthlyFixedExpenses: stmt!.monthly_fixed_expenses ?? null,
        monthlySavingsInvestment: stmt!.monthly_savings_investment ?? null,
        info: stmt!.info,
        createdAt: stmt!.created_at,
      },
    };
  }
}

// ─── prompt ─────────────────────────────────

function buildFsChatSystemPrompt(latest: any | null): string {
  let prompt = `재무재표 생성 AI`;

  if (latest) {
    prompt += `\n이전 데이터 있음`;
  }

  return prompt;
}
