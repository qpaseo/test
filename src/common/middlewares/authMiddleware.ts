import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenManager";
import { AppError, ErrorCode } from "../errors/AppError";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../modules/types/dto/response/basic.response";

/**
 * 인증 미들웨어
 * 액세스 토큰 검증 및 사용자 정보 추출
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction,
): void => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        "Authorization 헤더가 필요합니다",
        401,
      );
    }

    // Bearer 토큰 검증
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        "유효하지 않은 Authorization 헤더 형식입니다",
        401,
      );
    }

    const token = parts[1];

    // 토큰 검증
    const tokenPayload = verifyToken(token);

    // 요청 객체에 사용자 정보 추가
    req.userId = tokenPayload.userId;
    req.email = tokenPayload.email;
    req.tokenId = tokenPayload.tokenId;

    next();
  } catch (error) {
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
};

/**
 * 선택적 인증 미들웨어
 * 토큰이 있으면 검증하고, 없어도 진행
 */
export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        const token = parts[1];

        try {
          const tokenPayload = verifyToken(token);
          req.userId = tokenPayload.userId;
          req.email = tokenPayload.email;
          req.tokenId = tokenPayload.tokenId;
        } catch (error) {
          // 토큰 검증 실패 시에도 진행
          console.warn(
            "Token validation failed in optional middleware:",
            error,
          );
        }
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "내부 서버 오류가 발생했습니다",
      timestamp: new Date().toISOString(),
    });
  }
};
