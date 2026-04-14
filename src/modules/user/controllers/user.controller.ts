import { Response } from "express";

import { AppError, ErrorCode } from "../../../common/errors/AppError";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../types/dto/response/basic.response";
import { UserInfoResponse } from "../types/dto/response/user-info.response";
import { UserDashboardResponse } from "../types/dto/response/user-dashboard.response";
import { handleAuthError } from "../../../common/errors/HandleAuthError";
import { IUserService } from "../contracts/user.service";
import { IUserController } from "../contracts/user.controller";

export class UserController implements IUserController {
  constructor(
    private readonly userService: IUserService,
    private readonly financialService: any,
    private readonly chatService: any,
    private readonly fsChatService: any,
  ) {}

  async getUserInfo(
    req: AuthenticatedRequest,
    res: Response<ApiResponse<UserInfoResponse>>,
  ): Promise<void> {
    try {
      if (!req.userId) {
        throw AppError.fromCode(ErrorCode.UNAUTHORIZED);
      }

      const result = await this.userService.getUserById(req.userId);

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

  async getUserDashboard(
    req: AuthenticatedRequest,
    res: Response<ApiResponse<UserDashboardResponse>>,
  ): Promise<void> {
    try {
      if (!req.userId) {
        throw AppError.fromCode(ErrorCode.UNAUTHORIZED);
      }

      const [goals, finances, financialChats, chats] = await Promise.all([
        this.financialService.getGoals(req.userId),
        this.financialService.getMonthlyFinances(req.userId),
        this.fsChatService.getFinancialChatRoomsWithLastMessage(req.userId),
        this.chatService.getChatRooms(req.userId),
      ]);

      const result = {
        goals,
        monthlyFinances: finances,
        chatRooms: {
          financialStatementChats: financialChats,
          chats,
        },
      };

      res.status(200).json({
        success: true,
        code: "GET_USER_DASHBOARD_SUCCESS",
        message: "사용자 대시보드 조회가 완료되었습니다",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  }
}
