import { Response } from "express";
import { FsChatToolHandler, FS_CHAT_TOOLS } from "../tools/fs-chat.tools";
import { IOpenAIClient } from "../../../infrastructure/ai/contracts/openai-client";
import {
  toFsChatRoomWithLastMessageDto,
  toMessageDto,
  toMessageEntity,
} from "./mappers/financial.mappers";
import { buildFsChatSystemPrompt } from "./prompts/financial.chat.prompts";
import { IFsChatService } from "../contracts/services/financial.chat.service";
import { FsChatRoomWithLastMessage } from "../types/dto/response/financial-chat-last-message.response";
import { AppError, ErrorCode } from "../../../common/errors/app.error";
import { IIdGenerator } from "../../../common/utils/contracts/uuid.generator.util";
import { FinancialStatementDraft } from "../types/entity/financial-draft-change-proposal.entity";
import { FinancialStatementInput } from "../../financial/types/dto/request/financial-statement.create.request";
import { IFinancialRepository } from "../../financial/contracts/repository/financial.repository";
import { IFinancialChatMessageRepository } from "../contracts/repositories/financial.chat.message.repository";
import { IFinancialChatRoomRepository } from "../contracts/repositories/financial.chat.room.repository";
import { IFinancialDraftRepository } from "../contracts/repositories/financial.draft.repository";
import { IChatToolRepository } from "../contracts/repositories/chat.tool.repository";

export class FsChatService implements IFsChatService {
  constructor(
    private readonly financialRepo: IFinancialRepository,
    private readonly fsMessageRepo: IFinancialChatMessageRepository,
    private readonly fsRoomRepo: IFinancialChatRoomRepository,
    private readonly draftRepo: IFinancialDraftRepository,
    private readonly toolRepo: IChatToolRepository,
    private readonly toolHandler: FsChatToolHandler,
    private readonly openaiClient: IOpenAIClient,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async getFinancialChatRoomsWithLastMessage(
    userId: string,
  ): Promise<FsChatRoomWithLastMessage[]> {
    const rows =
      await this.fsRoomRepo.findFinancialChatRoomsWithLastMessage(userId);
    return rows.map(toFsChatRoomWithLastMessageDto);
  }

  async updateRoom(
    roomId: string,
    userId: string,
    input: { name: string; description?: string | null },
  ) {
    const room = await this.fsRoomRepo.findRoomById(roomId);

    if (!room) throw AppError.fromCode(ErrorCode.NOT_FOUND);
    if (room.user_id !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, "접근 권한이 없습니다.");
    }

    await this.fsRoomRepo.updateRoom(roomId, input);
    const updated = await this.fsRoomRepo.findRoomById(roomId);

    return {
      id: updated!.id,
      name: updated!.name,
      description: updated!.description,
      createdAt: new Date(updated!.created_at),
      updatedAt: updated!.updated_at ? new Date(updated!.updated_at) : null,
    };
  }

  async getRoomDetail(roomId: string, userId: string) {
    const roomRow = await this.fsRoomRepo.findRoomById(roomId);

    if (!roomRow) throw AppError.fromCode(ErrorCode.NOT_FOUND);
    if (roomRow.user_id !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, "접근 권한이 없습니다.");
    }

    // 메시지
    const messages = await this.fsMessageRepo.findMessagesByRoomId(roomId);

    // 1. 최신 확정 재무재표 (statement)
    const stmt = await this.toolRepo.findLatestStatementByUserId(userId);

    // 2. ACTIVE draft
    const draft = await this.draftRepo.findActiveDraftByRoomId(roomId);

    // 3. proposal (draft당 1개)
    let proposal = null;

    if (draft) {
      proposal = await this.draftRepo.findProposalByDraftId(draft.id);
    }

    function parseExpenseItems(value: any): { name: string; money: number }[] {
      if (!value) return [];

      // 이미 배열인 경우
      if (Array.isArray(value)) {
        return value.map((e) => ({
          ...e,
          money: Number(e.money),
        }));
      }

      // 문자열(JSON)인 경우
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.map((e) => ({
              ...e,
              money: Number(e.money),
            }));
          }
          return [];
        } catch {
          return [];
        }
      }

      return [];
    }

    // 4. statement 변환 (money string → number, null → [])
    const statement = stmt
      ? {
          netMonthlyIncome: Number(stmt.net_monthly_income ?? 0),
          monthlyFixedExpenses: parseExpenseItems(stmt.monthly_fixed_expenses),
          monthlySavingsInvestment: parseExpenseItems(
            stmt.monthly_savings_investment,
          ),
          info: stmt.info,
          createdAt: new Date(stmt.created_at),
        }
      : null;

    return {
      id: roomRow.id,
      name: roomRow.name,
      description: roomRow.description,
      createdAt: new Date(roomRow.created_at),
      updatedAt: roomRow.updated_at ? new Date(roomRow.updated_at) : null,

      messages: messages.map((m) => toMessageDto(toMessageEntity(m))),

      financial: {
        statement,

        proposal: proposal
          ? {
              fieldName: proposal.field_name,
              oldValue: proposal.old_value,
              newValue: proposal.new_value,
              reason: proposal.reason,
              status: proposal.status,
              createdAt: new Date(proposal.created_at),
            }
          : null,
      },
    };
  }

  async streamChat(
    roomId: string,
    userId: string,
    userMessage: string,
    res: Response,
  ): Promise<void> {
    // 1) 채팅방 검증
    const roomRow = await this.fsRoomRepo.findRoomById(roomId);

    if (!roomRow || roomRow.user_id !== userId) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        "해당 채팅방을 찾을 수 없거나 접근할 수 없습니다.",
      );
    }

    // 2) ACTIVE draft 확인 (없으면 생성)
    let draft = await this.draftRepo.findActiveDraftByRoomId(roomId);

    if (!draft) {
      const latestStatement =
        await this.toolRepo.findLatestStatementByUserId(userId);

      if (!latestStatement) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          "재무제표가 존재하지 않습니다. 먼저 재무제표를 생성해주세요.",
        );
      }

      await this.draftRepo.createDraft({
        id: this.idGenerator.generate(),
        financialStatementId: latestStatement.id,
        financialStatementChatRoomId: roomId,
        netMonthlyIncome: Number(latestStatement.net_monthly_income),
        monthlyFixedExpenses: latestStatement.monthly_fixed_expenses ?? null,
        monthlySavingsInvestment:
          latestStatement.monthly_savings_investment ?? null,
      });

      draft = await this.draftRepo.findActiveDraftByRoomId(roomId);
    }

    // 3) PENDING proposal 존재 시 차단
    const hasPending = await this.draftRepo.hasPendingProposal(draft!.id);

    if (hasPending) {
      throw new AppError(
        ErrorCode.CONFLICT,
        "처리되지 않은 수정 제안이 있습니다. 먼저 수락 또는 거절해주세요.",
      );
    }

    // 4) 유저 메시지 저장
    const nextIndex = await this.fsMessageRepo.getNextMessageIndex(roomId);

    await this.fsMessageRepo.createMessage({
      financialStatementChatRoomId: roomId,
      sender: "USER",
      content: userMessage,
      messageIndex: nextIndex,
    });

    // 5) 전체 메시지 + 시스템 프롬프트 구성
    const allMessages = await this.fsMessageRepo.findMessagesByRoomId(roomId);
    const systemPrompt = buildFsChatSystemPrompt(draft!);

    const messages = [
      { role: "system", content: systemPrompt },
      ...allMessages.map((m) => ({
        role: m.sender === "USER" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    // 6) SSE 헤더
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let finalContent = "";

    try {
      finalContent = await this.runToolLoop(messages, res, userId, draft!.id);
    } catch {
      res.write(`data: ${JSON.stringify({ error: "AI 오류" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    // 7) AI 메시지 저장
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
    draftId: string,
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

          // propose_draft_change 툴 호출 시 proposal 생성
          if (call.function.name === "propose_draft_change") {
            const result = await this.handleProposeDraftChange(args, draftId);
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              content: result,
            });
            continue;
          }

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

  async updateMyLatestStatement(
    userId: string,
    input: FinancialStatementInput,
  ) {
    await this.financialRepo.updateLatestStatement(userId, input);

    const stmt = await this.toolRepo.findLatestStatementByUserId(userId);

    if (!stmt) {
      throw new AppError(ErrorCode.NOT_FOUND, "재무재표 없음");
    }

    return {
      id: stmt.id,
      netMonthlyIncome: Number(stmt.net_monthly_income),
      monthlyFixedExpenses: stmt.monthly_fixed_expenses ?? [],
      monthlySavingsInvestment: stmt.monthly_savings_investment ?? [],
      info: stmt.info,
      createdAt: new Date(stmt.created_at),
    };
  }

  /**
   * AI가 재무제표 수정을 제안할 때 호출
   * draft를 직접 수정하지 않고 proposal을 생성해 유저의 수락/거절 대기
   */
  private async handleProposeDraftChange(
    args: {
      field_name: string;
      new_value: any;
      reason?: string;
    },
    draftId: string,
  ): Promise<string> {
    const draft = await this.draftRepo.findDraftById(draftId);

    if (!draft) {
      return JSON.stringify({ success: false, error: "draft 없음" });
    }

    const FIELD_MAP: Record<string, keyof FinancialStatementDraft> = {
      net_monthly_income: "netMonthlyIncome",
      monthly_fixed_expenses: "monthlyFixedExpenses",
      monthly_savings_investment: "monthlySavingsInvestment",
    };

    const targetField = FIELD_MAP[args.field_name];

    if (!targetField) {
      return JSON.stringify({ success: false, error: "허용되지 않는 필드" });
    }

    // DB Row → Snapshot 변환
    const oldValue: FinancialStatementDraft = {
      netMonthlyIncome: Number(draft.net_monthly_income ?? 0),
      monthlyFixedExpenses: draft.monthly_fixed_expenses,
      monthlySavingsInvestment: draft.monthly_savings_investment,
    };

    const newValue: FinancialStatementDraft = {
      ...oldValue,
      [targetField]: args.new_value,
    };

    await this.draftRepo.createProposal({
      id: this.idGenerator.generate(),
      financialStatementDraftId: draftId,
      fieldName: args.field_name,
      oldValue,
      newValue,
      reason: args.reason ?? null,
    });

    return JSON.stringify({
      success: true,
      message: "수정 제안이 생성되었습니다. 유저의 수락을 기다립니다.",
      fieldName: args.field_name,
      oldValue,
      newValue,
    });
  }

  async completeAndCreateStatement(
    roomId: string,
    userId: string,
    input: FinancialStatementInput,
  ): Promise<{ statement: any }> {
    const draft = await this.draftRepo.findActiveDraftByRoomId(roomId);

    if (!draft) {
      throw new AppError(ErrorCode.NOT_FOUND, "진행 중인 draft가 없습니다.");
    }

    const hasPending = await this.draftRepo.hasPendingProposal(draft.id);
    if (hasPending) {
      throw new AppError(
        ErrorCode.CONFLICT,
        "처리되지 않은 수정 제안이 있습니다.",
      );
    }

    // 1. draft → snapshot
    const base: FinancialStatementDraft = {
      netMonthlyIncome: Number(draft.net_monthly_income ?? 0),
      monthlyFixedExpenses: draft.monthly_fixed_expenses ?? [],
      monthlySavingsInvestment: draft.monthly_savings_investment ?? [],
    };

    function mergeUserInput(
      base: FinancialStatementDraft,
      input: FinancialStatementInput,
    ): FinancialStatementDraft {
      return {
        netMonthlyIncome: input.net_monthly_income ?? base.netMonthlyIncome,
        monthlyFixedExpenses:
          input.monthly_fixed_expenses ?? base.monthlyFixedExpenses,
        monthlySavingsInvestment:
          input.monthly_savings_investment ?? base.monthlySavingsInvestment,
      };
    }

    // 2. 유저 입력 merge (우선 적용)
    const merged = mergeUserInput(base, input);

    // 3. AI 보완 (비어있는 부분만 채우도록 유도)
    const ai = await this.openaiClient.createChatCompletion({
      messages: [
        {
          role: "system",
          content: `
유저가 제공한 값은 절대 변경하지 말고 유지하세요.
비어있는 필드만 보완하세요.

반드시 아래 형식의 JSON만 반환하세요:

{
  "netMonthlyIncome": number,
  "monthlyFixedExpenses": [{ "name": string, "money": number }],
  "monthlySavingsInvestment": [{ "name": string, "money": number }]
}

설명, 코드블럭, 텍스트 없이 JSON만 반환하세요.
`,
        },
        {
          role: "user",
          content: JSON.stringify(merged),
        },
      ],
    });

    let parsed: Partial<FinancialStatementDraft> = {};

    try {
      const raw = ai.choices?.[0]?.message?.content ?? "{}";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {};
    }

    const final: FinancialStatementDraft = {
      netMonthlyIncome:
        input.net_monthly_income !== undefined
          ? input.net_monthly_income
          : (parsed.netMonthlyIncome ?? base.netMonthlyIncome),

      monthlyFixedExpenses:
        input.monthly_fixed_expenses !== undefined
          ? input.monthly_fixed_expenses
          : (parsed.monthlyFixedExpenses ?? base.monthlyFixedExpenses),

      monthlySavingsInvestment:
        input.monthly_savings_investment !== undefined
          ? input.monthly_savings_investment
          : (parsed.monthlySavingsInvestment ?? base.monthlySavingsInvestment),
    };

    // 4. 저장
    await this.toolRepo.createStatement({
      id: this.idGenerator.generate(),
      userId,
      draft: {
        netMonthlyIncome: final.netMonthlyIncome,
        monthlyFixedExpenses: final.monthlyFixedExpenses,
        monthlySavingsInvestment: final.monthlySavingsInvestment,
      },
      info: "",
    });
    await this.draftRepo.deleteDraft(draft.id);
    await this.toolRepo.deleteOldestStatementIfExceedsLimit(userId);
    await this.draftRepo.updateDraftStatus(draft.id, "COMPLETED");
    await this.fsMessageRepo.deleteMessagesByRoomId(roomId);

    const stmt = await this.toolRepo.findLatestStatementByUserId(userId);

    return {
      statement: {
        id: stmt!.id,
        netMonthlyIncome: Number(stmt!.net_monthly_income),
        monthlyFixedExpenses: stmt!.monthly_fixed_expenses ?? [],
        monthlySavingsInvestment: stmt!.monthly_savings_investment ?? [],
        info: stmt!.info,
        createdAt: new Date(stmt!.created_at),
      },
    };
  }
}
