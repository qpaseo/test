import { Response } from "express";
import { ZodError } from "zod";
import { ApiResponse } from "../../modules/types/dto/response/basic.response";
import { AppError, ErrorCode } from "./app.error";

/**
 * 에러 처리 헬퍼
 */
export function handleAuthError(error: any, res: Response<ApiResponse>): void {
  // ZodError 처리
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
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

  // AppError 처리
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

  //그 외 예외
  console.error("Unexpected error:", error);
  res.status(500).json({
    success: false,
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "내부 서버 오류가 발생했습니다",
    timestamp: new Date().toISOString(),
  });
}
