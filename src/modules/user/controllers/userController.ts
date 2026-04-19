import { Response } from "express";

import { AppError, ErrorCode } from "../../../common/errors/AppError";
import { UserService } from "../services/userService";
import { UserInfoResponse } from "../types/dto/response/user-info.response";
import { ApiResponse, AuthRequest } from "../../types/dto/response/basic.response";
import { UserDashboardResponse } from "../types/dto/response/user-dashboard.response";
import { FinancialService } from "../../financial/services/FinancialService";
import { ChatService } from "../../chat/services/chatService";
import { FinancialChatService } from "../../chat/services/financialChatService";

export class UserController {
  /**
   * 사용자 정보 조회
   * GET /user
   */
  static async getUserInfo(
    req: AuthRequest,
    res: Response<ApiResponse<UserInfoResponse>>,
  ): Promise<void> {
    try {
      if (!req.userId) {
        throw AppError.fromCode(ErrorCode.UNAUTHORIZED);
      }

      const result = await UserService.getUserById(req.userId);

      res.status(200).json({
        success: true,
        code: "GET_USER_INFO_SUCCESS",
        message: "사용자 정보 조회가 완료되었습니다",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  }

  /**
   * 메인화면 정보 조회
   * GET /user/main
   */
  static async getUserDashboard(
    userId: string,
  ): Promise<UserDashboardResponse> {
    const [goals, finances, financialChats, ragChats] = await Promise.all([
      FinancialService.getGoals(userId),
      FinancialService.getMonthlyFinances(userId),
      FinancialChatService.getFinancialChatRooms(userId),
      ChatService.getRagChatRooms(userId),
    ]);

    return {
      onboardingGoals: goals.onboarding,
      financialPlansGoals: goals.financial,
      monthlyFinances: finances,
      chatRooms: {
        financialStatementChats: financialChats,
        chats: ragChats,
      },
    };
  }
}

/**
 * 에러 처리 헬퍼
 */
function handleAuthError(error: any, res: Response<ApiResponse>): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Zod 검증 에러
  if (error.name === "ZodError") {
    const formattedErrors = error.errors.map((err: any) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    res.status(400).json({
      success: false,
      code: ErrorCode.INVALID_INPUT,
      message: "입력값이 올바르지 않습니다",
      details: { errors: formattedErrors },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 예상치 못한 에러
  console.error("Unexpected error:", error);
  res.status(500).json({
    success: false,
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "내부 서버 오류가 발생했습니다",
    timestamp: new Date().toISOString(),
  });
}
