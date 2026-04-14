import { Response } from "express";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../types/dto/response/basic.response";

export interface IAuthController {
  signUp(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> | void;

  login(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> | void;

  refreshToken(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> | void;

  logout(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> | void;
}
