// ============================================
// Response Types
// ============================================

import { GetChatRoomsResponse } from "../../../../chat/types/dto/response/chat-rooms.response";
import { FinancialChatRoomsResponse } from "../../../../chat/types/dto/response/financial-chat-rooms.response";

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
  startDate: string | null; // 시작 날짜
  endDate: string | null; // 종료 날짜
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
  // 3.1.1 온보딩 질문에서 받은 목표 진척도
  onboardingGoals: GoalProgressItem[];

  // 3.1.2 재무설계에서 생긴 목표 진척도
  financialPlansGoals: GoalProgressItem[];

  // 3.1.3 달별 수입·지출 그래프 (연도별, 생성 순으로 정렬)
  monthlyFinances: MonthlyFinanceItem[];

  // 3.1.4 채팅 목록
  chatRooms: {
    // 재무설계표 채팅 (최근 생성 순)
    financialStatementChats: FinancialChatRoomsResponse[];

    chats: GetChatRoomsResponse[];
  };
}
