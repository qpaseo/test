import { Response } from "express";

import { AppError, ErrorCode } from "../../../common/errors/app.error";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../types/dto/response/basic.response";
import { UserInfoResponse } from "../types/dto/response/user-info.response";
import { UserDashboardResponse } from "../types/dto/response/user-dashboard.response";
import { handleAuthError } from "../../../common/errors/handle.auth.error";
import { IUserService } from "../contracts/service/user.service";
import { IUserController } from "../contracts/controller/user.controller";
import { IFinancialService } from "../../financial/contracts/service/financial.service";
import { IChatService } from "../../chat/contracts/services/chat.service";
import { IFsChatService } from "../../chat/contracts/services/financial.chat.service";

export class UserController implements IUserController {
  constructor(
    private readonly userService: IUserService,
    private readonly financialService: IFinancialService,
    private readonly chatService: IChatService,
    private readonly fsChatService: IFsChatService,
  ) {}

  getUserInfo = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<UserInfoResponse>>,
  ): Promise<void> => {
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
  };

  getUserDashboard = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<UserDashboardResponse>>,
  ): Promise<void> => {
    try {
      if (!req.userId) {
        throw AppError.fromCode(ErrorCode.UNAUTHORIZED);
      }

      const [goals, finances, financialChats, chats] = await Promise.all([
        this.financialService.getGoals(req.userId),
        this.financialService.getMonthlyFinances(req.userId),
        this.fsChatService.getFinancialChatRoomsWithLastMessage(req.userId),
        this.chatService.getRagChatRooms(req.userId),
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
  };
}
