import { Response } from "express";
import { AuthRequest, ApiResponse } from "../types/index";
import { AuthService } from "../services/authService";
import {
  SignUpRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  LogoutRequestSchema,
} from "../validators/authValidator";
import {
  verifyRefreshToken,
  deleteRefreshToken,
  refreshAccessToken,
} from "../../common/utils/tokenManager";
import { AppError, ErrorCode } from "../../common/errors/AppError";

/**
 * Auth Controller
 */
export class AuthController {
  /**
   * 회원가입
   * POST /auth/sign-up
   */
  static async signUp(
    req: AuthRequest,
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
    req: AuthRequest,
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
   * 사용자 정보 조회
   * GET /auth/me
   */
  static async getUserInfo(
    req: AuthRequest,
    res: Response<ApiResponse>,
  ): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "인증이 필요합니다", 401);
      }

      const result = await AuthService.getUserInfo(req.userId);

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
   * 토큰 리프레시
   * POST /auth/refresh
   */
  static async refreshToken(
    req: AuthRequest,
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
    req: AuthRequest,
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
