export type ChatSender = "USER" | "AI";

// ========================
// Internal Types (Service / Repository Input)
// ========================

export interface UpdateChatRoomInput {
  name: string;
  description?: string;
}
export interface CreateChatRoomInput {
  userId: string;
  name: string;
  description?: string;
}

export interface CreateChatMessageInput {
  chatRoomId: string;
  sender: ChatSender;
  content: string;
  messageIndex: number;
}

export interface CreateChatMemoryInput {
  chatRoomId: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export interface UpdateUserMemoryInput {
  userId: string;
  content: {
    메모리: string;
    중요정보: string;
  };
}

export interface GetMessagesByIndexRangeInput {
  chatRoomId: string;
  startIndex: number;
  endIndex?: number;
}

export interface GetMonthlyFinanceInput {
  userId: string;
  year: number;
  month: number;
}

export interface GetMonthlyFinanceRangeInput {
  userId: string;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
}

export interface CreateFinancialGoalInput {
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  monthlyContribution?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CreateFsChatRoomInput {
  userId: string;
  name: string;
  description?: string;
}

export interface CreateFsChatMessageInput {
  financialStatementChatRoomId: string;
  sender: ChatSender;
  content: string;
  messageIndex: number;
}

export interface CreateFinancialStatementInput {
  userId: string;
  netMonthlyIncome: number;
  monthlyFixedExpenses: Record<string, number> | null;
  monthlySavingsInvestment: Record<string, number> | null;
  info: string;
}

// ========================
// AI Tool 호출 파라미터 타입
// ========================

export interface ToolGetMemoriesParams {
  chatRoomId: string;
}

export interface ToolGetMemoryByIdParams {
  memoryId: string;
}

export interface ToolGetMessagesByIndexParams {
  chatRoomId: string;
  startIndex: number;
  endIndex?: number;
}

export interface ToolGetUserMemoryParams {
  userId: string;
}

export interface ToolGetFinancialGoalsParams {
  userId: string;
}

export interface ToolGetMonthlyFinanceParams {
  userId: string;
  year: number;
  month: number;
  endYear?: number;
  endMonth?: number;
}

export interface ToolAddFinancialGoalParams {
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  monthlyContribution?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ToolGetFinancialStatementParams {
  userId: string;
}

// ========================
// SSE Payload 타입
// ========================

export interface SseChunkPayload {
  chunk: string;
}

export interface SseSourcesPayload {
  sources: Array<{
    id: string;
    pageNumber: number;
    content: string;
  }>;
}
