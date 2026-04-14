import OpenAI from "openai";
import { Pool } from "pg";
import { ChatMemoryRepository } from "../repositories/chat.memory.repository";
import { ChatMessageRepository } from "../repositories/chat.message.repository";
import { ChatToolRepository } from "../repositories/chat.tool.repository";
import { UserMemoryContent } from "../../user/types/entity/user-memory.entity";

// ─── Tool 정의 ───────────────────────────────────────────

export const CHAT_TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_memory_list",
      description:
        "현재 채팅방의 요약(메모리) 리스트를 불러옵니다. 요약 1줄과 id를 반환합니다.",
      parameters: {
        type: "object",
        properties: {
          chat_room_id: {
            type: "string",
            description: "채팅방 UUID",
          },
        },
        required: ["chat_room_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_memory_by_id",
      description: "메모리 id로 특정 요약 전체 내용을 불러옵니다.",
      parameters: {
        type: "object",
        properties: {
          memory_id: {
            type: "string",
            description: "메모리 UUID",
          },
        },
        required: ["memory_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_messages_by_index",
      description:
        "채팅방의 메세지를 index 기준으로 가져옵니다. start_index만 입력 시 하나만, end_index 입력 시 범위로 가져옵니다.",
      parameters: {
        type: "object",
        properties: {
          chat_room_id: {
            type: "string",
            description: "채팅방 UUID",
          },
          start_index: {
            type: "number",
            description: "시작 메세지 index",
          },
          end_index: {
            type: "number",
            description: "끝 메세지 index (생략 시 start_index 하나만)",
          },
        },
        required: ["chat_room_id", "start_index"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_memory",
      description: "유저의 경제 경험 메모리를 가져옵니다.",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "유저 UUID",
          },
        },
        required: ["user_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_financial_statement",
      description: "유저의 가장 최근 재무재표를 가져옵니다.",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "유저 UUID",
          },
        },
        required: ["user_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_financial_goals",
      description: "유저의 재정 목표 전부를 가져옵니다.",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "유저 UUID",
          },
        },
        required: ["user_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_monthly_finance",
      description:
        "유저의 월간 재정 상황을 가져옵니다. 단일 달 또는 범위(start_year~end_year, start_month~end_month)로 조회 가능합니다.",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "유저 UUID",
          },
          year: {
            type: "number",
            description: "조회 년도",
          },
          month: {
            type: "number",
            description: "조회 월",
          },
          end_year: {
            type: "number",
            description: "범위 조회 시 끝 년도",
          },
          end_month: {
            type: "number",
            description: "범위 조회 시 끝 월",
          },
        },
        required: ["user_id", "year", "month"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_financial_goal",
      description: "유저의 재정 목표를 추가합니다.",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "유저 UUID",
          },
          name: {
            type: "string",
            description: "목표 이름",
          },
          description: {
            type: "string",
            description: "목표 설명",
          },
          target_amount: {
            type: "number",
            description: "목표 금액",
          },
          current_amount: {
            type: "number",
            description: "현재 저축된 금액 (기본 0)",
          },
          monthly_contribution: {
            type: "number",
            description: "월 납입 금액 (기본 0)",
          },
          start_date: {
            type: "string",
            description: "시작 날짜 (YYYY-MM-DD, 없으면 null)",
            nullable: true,
          },
          end_date: {
            type: "string",
            description: "종료 날짜 (YYYY-MM-DD, 없으면 null)",
            nullable: true,
          },
        },
        required: ["user_id", "name", "target_amount"],
      },
    },
  },
];

// ─── Tool Handler ─────────────────────────────────────────

export class ChatToolHandler {
  private memoryRepo: ChatMemoryRepository;
  private messageRepo: ChatMessageRepository;
  private toolRepo: ChatToolRepository;

  constructor(db: Pool) {
    this.memoryRepo = new ChatMemoryRepository(db);
    this.messageRepo = new ChatMessageRepository(db);
    this.toolRepo = new ChatToolRepository(db);
  }

  async handle(toolName: string, args: Record<string, any>): Promise<string> {
    try {
      switch (toolName) {
        case "get_memory_list": {
          const memories = await this.memoryRepo.findMemoriesByRoomId(
            args.chat_room_id,
          );
          const result = memories.map((m) => ({
            id: m.id,
            summary: m.content.split("\n")[0],
            startIndex: m.start_index,
            endIndex: m.end_index,
          }));
          return JSON.stringify(result);
        }

        case "get_memory_by_id": {
          const memory = await this.memoryRepo.findMemoryById(args.memory_id);
          if (!memory)
            return JSON.stringify({ error: "메모리를 찾을 수 없습니다." });
          return JSON.stringify({
            id: memory.id,
            content: memory.content,
            startIndex: memory.start_index,
            endIndex: memory.end_index,
          });
        }

        case "get_messages_by_index": {
          const messages = await this.messageRepo.findMessagesByIndexRange(
            args.chat_room_id,
            args.start_index,
            args.end_index,
          );
          return JSON.stringify(
            messages.map((m) => ({
              sender: m.sender,
              content: m.content,
              messageIndex: m.message_index,
            })),
          );
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

        case "get_financial_statement": {
          const stmt = await this.toolRepo.findLatestStatementByUserId(
            args.user_id,
          );
          if (!stmt) return JSON.stringify({ error: "재무재표가 없습니다." });
          return JSON.stringify({
            id: stmt.id,
            netMonthlyIncome: Number(stmt.net_monthly_income),
            // PostgreSQL: JSON 컬럼 자동 파싱
            monthlyFixedExpenses: stmt.monthly_fixed_expenses ?? null,
            monthlySavingsInvestment: stmt.monthly_savings_investment ?? null,
            info: stmt.info,
            createdAt: stmt.created_at,
          });
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
            const finances = await this.toolRepo.findMonthlyFinanceRange(
              args.user_id,
              args.year,
              args.month,
              args.end_year,
              args.end_month,
            );
            return JSON.stringify(
              finances.map((f) => ({
                year: f.year,
                month: f.month,
                income: Number(f.income),
                expense: Number(f.expense),
              })),
            );
          } else {
            const finance = await this.toolRepo.findMonthlyFinance(
              args.user_id,
              args.year,
              args.month,
            );
            if (!finance)
              return JSON.stringify({ error: "해당 월 데이터가 없습니다." });
            return JSON.stringify({
              year: finance.year,
              month: finance.month,
              income: Number(finance.income),
              expense: Number(finance.expense),
            });
          }
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
            message: "목표가 추가되었습니다.",
          });
        }

        default:
          return JSON.stringify({ error: `알 수 없는 tool: ${toolName}` });
      }
    } catch (err) {
      return JSON.stringify({ error: "Tool 실행 중 오류가 발생했습니다." });
    }
  }
}
