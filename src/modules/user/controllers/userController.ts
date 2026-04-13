import { Response } from "express";

import { AppError, ErrorCode } from "../../../common/errors/AppError";
import { UserService } from "../services/userService";
import { UserInfoResponse } from "../types/dto/response/user-info.response";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../types/dto/response/basic.response";
import { UserDashboardResponse } from "../types/dto/response/user-dashboard.response";
import { FinancialService } from "../../financial/services/FinancialService";
import { ChatService } from "../../chat/services/chatService";
import { handleAuthError } from "../../../common/errors/HandleAuthError";

export class UserController {
  /**
   * 사용자 정보 조회
   * GET /user
   */
  static async getUserInfo(
    req: AuthenticatedRequest,
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
    req: AuthenticatedRequest,
    res: Response<ApiResponse<UserDashboardResponse>>,
  ): Promise<void> {
    try {
      if (!req.userId) {
        throw AppError.fromCode(ErrorCode.UNAUTHORIZED);
      }

      const [goals, finances, financialChats, ragChats] = await Promise.all([
        FinancialService.getGoals(req.userId),
        FinancialService.getMonthlyFinances(req.userId),
        FinancialChatService.getFinancialChatRooms(req.userId),
        ChatService.getRagChatRooms(req.userId),
      ]);

      const result = {
        goals,
        monthlyFinances: finances,
        chatRooms: {
          financialStatementChats: financialChats,
          chats: ragChats,
        },
      };

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
}
