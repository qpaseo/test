import { Response } from "express";
import {
  SignUpRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  LogoutRequestSchema,
} from "../validators/auth.validator";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../types/dto/response/basic.response";
import { handleAuthError } from "../../../common/errors/handle.auth.error";
import { ITokenManager } from "../../../common/utils/contracts/token.manager.util";
import { IAuthService } from "../contracts/services/auth.service";
import { IAuthController } from "../contracts/controllers/auth.controller";

/**
 * Auth Controller
 */
export class AuthController implements IAuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly tokenManager: ITokenManager,
  ) {}

  /**
   * 회원가입
   */
  signUp = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    try {
      const validatedData = SignUpRequestSchema.parse(req.body);

      const result = await this.authService.signUp(validatedData);

      res.status(201).json({
        success: true,
        code: "SIGN_UP_SUCCESS",
        message: "회원가입이 완료되었습니다",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  /**
   * 로그인
   */
  login = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    try {
      const validatedData = LoginRequestSchema.parse(req.body);

      const result = await this.authService.login(validatedData);

      res.status(200).json({
        success: true,
        code: "LOGIN_SUCCESS",
        message: "로그인이 완료되었습니다",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  /**
   * 토큰 리프레시
   */
  refreshToken = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    try {
      const validatedData = RefreshTokenRequestSchema.parse(req.body);

      const decoded = await this.tokenManager.verifyRefreshToken(
        validatedData.refreshToken,
      );

      const newAccessToken = this.tokenManager.generateAccessToken(
        decoded.userId,
        decoded.email,
      );

      res.status(200).json({
        success: true,
        code: "REFRESH_TOKEN_SUCCESS",
        message: "토큰이 갱신되었습니다",
        data: {
          accessToken: newAccessToken,
          accessTokenExpiresIn: "1h",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  /**
   * 로그아웃
   */
  logout = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    try {
      const validatedData = LogoutRequestSchema.parse(req.body);

      const decoded = await this.tokenManager.verifyRefreshToken(
        validatedData.refreshToken,
      );

      await this.tokenManager.deleteRefreshToken(
        decoded.userId,
        decoded.tokenId,
      );

      res.status(200).json({
        success: true,
        code: "LOGOUT_SUCCESS",
        message: "로그아웃이 완료되었습니다",
        data: {
          message: "로그아웃되었습니다",
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };
}
