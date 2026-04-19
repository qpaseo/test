import { Response, NextFunction } from "express";
import { AppError, ErrorCode } from "../errors/app.error";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../modules/types/dto/response/basic.response";
import { ITokenManager } from "../utils/contracts/token.manager.util";

/**
 * Auth Middleware (DI Class)
 */
export class AuthMiddleware {
  constructor(private readonly tokenManager: ITokenManager) {}

  /**
   * 필수 인증 미들웨어
   */
  auth = (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new AppError(
          ErrorCode.UNAUTHORIZED,
          "Authorization 헤더가 필요합니다",
          401,
        );
      }

      const parts = authHeader.split(" ");

      if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new AppError(
          ErrorCode.UNAUTHORIZED,
          "유효하지 않은 Authorization 헤더 형식입니다",
          401,
        );
      }

      const token = parts[1];
      const payload = this.tokenManager.verifyToken(token);

      req.userId = payload.userId;
      req.email = payload.email;
      req.tokenId = payload.tokenId;

      next();
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * 선택 인증 미들웨어
   */
  optional = (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        next();
        return;
      }

      const parts = authHeader.split(" ");

      if (parts.length !== 2 || parts[0] !== "Bearer") {
        next();
        return;
      }

      const token = parts[1];

      try {
        const payload = this.tokenManager.verifyToken(token);

        req.userId = payload.userId;
        req.email = payload.email;
        req.tokenId = payload.tokenId;
      } catch {
        // optional auth에서는 실패 무시
      }

      next();
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * 공통 에러 핸들링
   */
  private handleError(error: unknown, res: Response<ApiResponse>): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(500).json({
      success: false,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "내부 서버 오류가 발생했습니다",
      timestamp: new Date().toISOString(),
    });
  }
}
