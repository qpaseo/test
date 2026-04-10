import { Response } from "express";
import { AuthService } from "../services/authService";
import {
  SignUpRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  LogoutRequestSchema,
} from "../validators/authValidator";
import {
  deleteRefreshToken,
  refreshAccessToken,
  verifyRefreshToken,
} from "../../../common/utils/tokenManager";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../types/dto/response/basic.response";
import { handleAuthError } from "../../../common/errors/HandleAuthError";

/**
 * Auth Controller
 */
export class AuthController {
  /**
   * 회원가입
   * POST /auth/sign-up
   */
  static async signUp(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> {
    try {
      // 입력 검증
      const validatedData = SignUpRequestSchema.parse(req.body);

      // 서비스 호출
      const result = await AuthService.signUp(validatedData);

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
  }

  /**
   * 로그인
   * POST /auth/login
   */
  static async login(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> {
    try {
      // 입력 검증
      const validatedData = LoginRequestSchema.parse(req.body);

      // 서비스 호출
      const result = await AuthService.login(validatedData);

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
  }

  /**
   * 토큰 리프레시
   * POST /auth/refresh
   */
  static async refreshToken(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> {
    try {
      // 입력 검증
      const validatedData = RefreshTokenRequestSchema.parse(req.body);

      // 리프레시 토큰 검증
      await verifyRefreshToken(validatedData.refreshToken);

      // 새 액세스 토큰 발급
      const newAccessToken = await refreshAccessToken(
        validatedData.refreshToken,
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
  }

  /**
   * 로그아웃
   * POST /auth/logout
   */
  static async logout(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
  ): Promise<void> {
    try {
      // 입력 검증
      const validatedData = LogoutRequestSchema.parse(req.body);

      // 리프레시 토큰 검증 및 정보 추출
      const tokenPayload = await verifyRefreshToken(validatedData.refreshToken);

      // 리프레시 토큰 삭제
      await deleteRefreshToken(tokenPayload.userId, tokenPayload.tokenId);

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
  }
}
