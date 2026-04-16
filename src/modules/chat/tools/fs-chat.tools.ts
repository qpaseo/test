import OpenAI from "openai";
import { Pool } from "pg";
import { ChatToolRepository } from "../repositories/chat.tool.repository";
import { UserMemoryContent } from "../../user/types/entity/user-memory.entity";
import { IRagService } from "../../rag/contracts/service/rag.service";

// ─── Tool 정의 ────────────────────────────────────────────

export const FS_CHAT_TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_previous_financial_statement",
      description: "유저의 가장 최근에 만들어진 재무재표를 불러옵니다.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string" },
        },
        required: ["user_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_memory",
      description: "유저 메모리 조회",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string" },
        },
        required: ["user_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_financial_goals",
      description: "재정 목표 조회",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string" },
        },
        required: ["user_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_monthly_finance",
      description: "월별 재정 조회",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          year: { type: "number" },
          month: { type: "number" },
          end_year: { type: "number" },
          end_month: { type: "number" },
        },
        required: ["user_id", "year", "month"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_financial_goal",
      description: "재정 목표 추가",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          target_amount: { type: "number" },
          current_amount: { type: "number" },
          monthly_contribution: { type: "number" },
          start_date: { type: "string", nullable: true },
          end_date: { type: "string", nullable: true },
        },
        required: ["user_id", "name", "target_amount"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_draft_change",
      description:
        "재무제표 수정을 제안합니다. 실제로 값을 변경하지 않고, 유저의 승인을 기다립니다.",
      parameters: {
        type: "object",
        properties: {
          field_name: {
            type: "string",
            enum: [
              "net_monthly_income",
              "monthly_fixed_expenses",
              "monthly_savings_investment",
            ],
          },
          new_value: {
            description:
              "변경할 값. 수입은 number, 지출/저축은 ExpenseItem 배열",
          },
          reason: {
            type: "string",
          },
        },
        required: ["field_name", "new_value"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_financial_documents",
      description:
        "업로드된 PDF 문서에서 질문과 관련된 내용을 검색합니다. " +
        "유저가 문서 기반으로 질문하거나, 재무 관련 계약서/보고서 내용이 필요할 때 사용하세요.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "검색할 내용 또는 질문",
          },
          top_k: {
            type: "number",
            description: "반환할 최대 결과 수 (기본값 5, 최대 10)",
          },
          doc_id: {
            type: "string",
            description:
              "특정 문서 내에서만 검색할 경우 해당 문서의 UUID. 생략 시 전체 문서 검색.",
            nullable: true,
          },
        },
        required: ["query"],
      },
    },
  },
];

// ─── Tool Handler ─────────────────────────────────────────

export class FsChatToolHandler {
  private readonly toolRepo: ChatToolRepository;
  private readonly ragService: IRagService;

  constructor(db: Pool, ragService: IRagService) {
    this.toolRepo = new ChatToolRepository(db);
    this.ragService = ragService;
  }

  async handle(toolName: string, args: Record<string, any>): Promise<string> {
    try {
      switch (toolName) {
        case "get_previous_financial_statement": {
          const stmt = await this.toolRepo.findLatestStatementByUserId(
            args.user_id,
          );

          if (!stmt) {
            return JSON.stringify({ error: "이전 재무재표 없음" });
          }

          return JSON.stringify({
            id: stmt.id,
            netMonthlyIncome: Number(stmt.net_monthly_income),
            monthlyFixedExpenses: stmt.monthly_fixed_expenses ?? null,
            monthlySavingsInvestment: stmt.monthly_savings_investment ?? null,
            info: stmt.info,
            createdAt: stmt.created_at,
          });
        }

        case "get_user_memory": {
          const mem = await this.toolRepo.findUserMemoryByUserId(args.user_id);
          if (!mem)
            return JSON.stringify({
              memory: "",
              important_information: "",
            } as UserMemoryContent);
          return JSON.stringify(mem.content);
        }

        case "get_financial_goals": {
          const goals = await this.toolRepo.findGoalsByUserId(args.user_id);

          return JSON.stringify(
            goals.map((g) => ({
              id: g.id,
              name: g.name,
              description: g.description,
              targetAmount: Number(g.target_amount),
              currentAmount: Number(g.current_amount),
              monthlyContribution: Number(g.monthly_contribution),
              startDate: g.start_date,
              endDate: g.end_date,
            })),
          );
        }

        case "get_monthly_finance": {
          if (args.end_year && args.end_month) {
            const list = await this.toolRepo.findMonthlyFinanceRange(
              args.user_id,
              args.year,
              args.month,
              args.end_year,
              args.end_month,
            );

            return JSON.stringify(
              list.map((f) => ({
                year: f.year,
                month: f.month,
                income: Number(f.income),
                expense: Number(f.expense),
              })),
            );
          }

          const f = await this.toolRepo.findMonthlyFinance(
            args.user_id,
            args.year,
            args.month,
          );

          if (!f) {
            return JSON.stringify({ error: "데이터 없음" });
          }

          return JSON.stringify({
            year: f.year,
            month: f.month,
            income: Number(f.income),
            expense: Number(f.expense),
          });
        }

        case "add_financial_goal": {
          await this.toolRepo.createGoal({
            userId: args.user_id,
            name: args.name,
            description: args.description,
            targetAmount: args.target_amount,
            currentAmount: args.current_amount,
            monthlyContribution: args.monthly_contribution,
            startDate: args.start_date ?? null,
            endDate: args.end_date ?? null,
          });

          return JSON.stringify({
            success: true,
          });
        }

        case "search_financial_documents": {
          const results = await this.ragService.searchChunks(
            args.query,
            args.top_k ?? 5,
            args.doc_id ?? undefined,
          );
          return JSON.stringify(results);
        }

        default:
          return JSON.stringify({ error: "unknown tool" });
      }
    } catch {
      return JSON.stringify({ error: "tool error" });
    }
  }
}
