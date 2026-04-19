// ============================================
// Response Types
// ============================================

import { ChatRoomsResponse } from "../../../../chat/types/dto/response/chat-rooms.response";

/**
 * 3.1.1 목표 진척도 (온보딩 질문)
 * 3.1.2 목표 진척도 (재무설계)
 */
export interface GoalProgressItem {
  id: string; // 목표 ID
  name: string; // 목표명
  description: string | null; // 목표 설명
  targetAmount: number; // 목표 금액
  currentAmount: number; // 현재 금액
  progressPercentage: number; // 진척도 (%)
  monthlyContribution: number; // 월 기여도
  startDate: Date | null; // 시작 날짜
  endDate: Date | null; // 종료 날짜
}

/**
 * 3.1.3 월별 수입·지출 데이터
 */
export interface MonthlyFinanceItem {
  year: number;
  month: number;
  income: number;
  expense: number;
}

/**
 * 유저 대시보드 화면 응답
 */
export interface UserDashboardResponse {
  goals: GoalProgressItem[];
  monthlyFinances: MonthlyFinanceItem[];
  chatRooms: {
    financialStatementChats: ChatRoomsResponse[] | null;
    chats: ChatRoomsResponse[] | null;
  };
}
