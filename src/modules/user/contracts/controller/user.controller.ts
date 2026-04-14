import { Response } from "express";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../../types/dto/response/basic.response";
import { UserInfoResponse } from "../../types/dto/response/user-info.response";
import { UserDashboardResponse } from "../../types/dto/response/user-dashboard.response";

export interface IUserController {
  getUserInfo(
    req: AuthenticatedRequest,
    res: Response<ApiResponse<UserInfoResponse>>,
  ): Promise<void>;

  getUserDashboard(
    req: AuthenticatedRequest,
    res: Response<ApiResponse<UserDashboardResponse>>,
  ): Promise<void>;
}
