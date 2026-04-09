import { Response } from "express";

import { AppError, ErrorCode } from "../../../common/errors/AppError";
import { ApiResponse, UserInfoResponse } from "../../auth/types";
import { UserService } from "../services/userService";

export class UserController {
  /**
   * 사용자 정보 조회
   * GET /user
   */
  static async getUserInfo(userId: string): Promise<UserInfoResponse> {
    const user = await UserService.getUserById(userId);

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      hasLoan: user.has_loan,
      hasStock: user.has_stock,
      recentPlanDate: user.recent_plan_date,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  /**
   * 메인화면 정보 조회
   * GET /user/main
   */
  //   static async getUserDashboard(
  //     userId: string,
  //   ): Promise<UserDashboardResponse> {
  //     const [goals, finances, chats] = await Promise.all([
  //       FinancialService.getGoals(userId),
  //       FinancialService.getMonthlyFinances(userId),
  //       Financia.getChatRooms(userId),
  //     ]);

  //     return {
  //       onboardingGoals: goals.onboarding,
  //       financialPlansGoals: goals.financial,
  //       monthlyFinances: finances,
  //       chatRooms: chats,
  //     };
  //   }
  // }
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
