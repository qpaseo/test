import { Response } from "express";
import { ChatToolRepository } from "../repositories/chat.tool.repository";
import { FsChatToolHandler, FS_CHAT_TOOLS } from "../tools/fs-chat.tools";
import { FinancialChatRoomRepository } from "../repositories/financial.chat.room.repository";
import { FinancialChatMessageRepository } from "../repositories/financial.chat.message.repository";
import { IOpenAIClient } from "../../../infrastructure/ai/contracts/openai-client";
import {
  toFsChatRoomWithLastMessageDto,
  toMessageDto,
  toMessageEntity,
  toRoomEntity,
  toRoomSummaryDto,
} from "./mappers/financial.mappers";
import { buildFsChatSystemPrompt } from "./prompts/financial.chat.prompts";
import { IFsChatService } from "../contracts/services/financial.chat.service";
import { FsChatRoomWithLastMessage } from "../types/dto/response/financial-chat-last-message.response";

export class FsChatService implements IFsChatService {
  constructor(
    private readonly fsMessageRepo: FinancialChatMessageRepository,
    private readonly fsRoomRepo: FinancialChatRoomRepository,
    private readonly toolRepo: ChatToolRepository,
    private readonly toolHandler: FsChatToolHandler,
    private readonly openaiClient: IOpenAIClient,
  ) {}

  async getFinancialChatRoomsWithLastMessage(
    userId: string,
  ): Promise<FsChatRoomWithLastMessage[]> {
    const rows =
      await this.fsRoomRepo.findFinancialChatRoomsWithLastMessage(userId);

    return rows.map(toFsChatRoomWithLastMessageDto);
  }

  async getRoomList(userId: string, page: number, pageSize: number) {
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

  async getRoomDetail(roomId: string, userId: string) {
    const roomRow = await this.fsRoomRepo.findRoomById(roomId);

    if (!roomRow) throw new Error("채팅방을 찾을 수 없습니다.");
    if (roomRow.user_id !== userId) throw new Error("접근 권한이 없습니다.");

    const messages = await this.fsMessageRepo.findMessagesByRoomId(roomId);

    return {
      id: roomRow.id,
      name: roomRow.name,
      description: roomRow.description,
      createdAt: new Date(roomRow.created_at),
      updatedAt: roomRow.updated_at ? new Date(roomRow.updated_at) : null,
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
        role: m.sender === "USER" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let finalContent = "";

    try {
      finalContent = await this.runToolLoop(messages, res, userId);
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

  private async runToolLoop(
    messages: any[],
    res: Response,
    userId: string,
  ): Promise<string> {
    let final = "";

    while (true) {
      const response = await this.openaiClient.createChatCompletion({
        messages,
        tools: FS_CHAT_TOOLS,
        tool_choice: "auto",
      });

      const choice = response.choices[0];

      if (choice.finish_reason === "tool_calls") {
        messages.push(choice.message);

        for (const call of choice.message.tool_calls ?? []) {
          if (call.type !== "function") continue;

          const args = JSON.parse(call.function.arguments);

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
          res.write(
            `event: message\ndata: ${JSON.stringify({ chunk: delta })}\n\n`,
          );
        }
      }
      break;
    }

    return final;
  }

  async completeAndCreateStatement(roomId: string, userId: string) {
    const messages = await this.fsMessageRepo.findMessagesByRoomId(roomId);

    if (!messages.length) throw new Error("대화 없음");

    const text = messages.map((m) => `[${m.sender}] ${m.content}`).join("\n");

    const ai = await this.openaiClient.createChatCompletion({
      messages: [
        { role: "system", content: "재무재표 JSON 생성" },
        { role: "user", content: text },
      ],
    });

    const rawContent = ai.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("AI 응답 없음");
    }

    const cleaned = rawContent.replace(/```json|```/g, "").trim();

    let parsed: any;

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      throw new Error(
        `JSON 파싱 실패: ${(e as Error)?.message ?? "unknown error"}`,
      );
    }

    await this.toolRepo.deleteOldestStatementIfExceedsLimit(userId);

    await this.toolRepo.createStatement({
      userId,
      ...parsed,
    });

    await this.fsMessageRepo.deleteMessagesByRoomId(roomId);

    const stmt = await this.toolRepo.findLatestStatementByUserId(userId);

    if (!stmt) {
      throw new Error("statement 조회 실패");
    }

    return {
      statement: {
        id: stmt.id,
        netMonthlyIncome: Number(stmt.net_monthly_income),
        monthlyFixedExpenses: stmt.monthly_fixed_expenses ?? null,
        monthlySavingsInvestment: stmt.monthly_savings_investment ?? null,
        info: stmt.info,
        createdAt: new Date(stmt.created_at),
      },
    };
  }
}
