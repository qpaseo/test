/**
 * 커스텀 에러 클래스
 * Java의 Exception 처럼 모든 에러를 이곳에서 관리
 */

export enum ErrorCode {
  // 공통
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",

  // 인증 관련
  INVALID_EMAIL_FORMAT = "INVALID_EMAIL_FORMAT",
  INVALID_PASSWORD_FORMAT = "INVALID_PASSWORD_FORMAT",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",
  REFRESH_TOKEN_NOT_FOUND = "REFRESH_TOKEN_NOT_FOUND",

  // 데이터 검증
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
  INVALID_INPUT = "INVALID_INPUT",
}

interface ErrorResponse {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 400,
    details?: Record<string, any>,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = "AppError";

    // Maintains proper stack trace
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public toResponse(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}

// 에러 맵핑
export const ERROR_MAP: Record<
  ErrorCode,
  { statusCode: number; message: string }
> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    statusCode: 500,
    message: "내부 서버 오류",
  },
  [ErrorCode.BAD_REQUEST]: { statusCode: 400, message: "잘못된 요청" },
  [ErrorCode.UNAUTHORIZED]: { statusCode: 401, message: "인증이 필요합니다" },
  [ErrorCode.FORBIDDEN]: { statusCode: 403, message: "접근 권한이 없습니다" },
  [ErrorCode.NOT_FOUND]: {
    statusCode: 404,
    message: "요청한 리소스를 찾을 수 없습니다",
  },
  [ErrorCode.CONFLICT]: { statusCode: 409, message: "요청 충돌" },

  // 인증 관련
  [ErrorCode.INVALID_EMAIL_FORMAT]: {
    statusCode: 400,
    message: "이메일 형식이 올바르지 않습니다",
  },
  [ErrorCode.INVALID_PASSWORD_FORMAT]: {
    statusCode: 400,
    message: "비밀번호는 최소 7자 이상이며 특수문자를 포함해야 합니다",
  },
  [ErrorCode.USER_ALREADY_EXISTS]: {
    statusCode: 409,
    message: "이미 존재하는 사용자입니다",
  },
  [ErrorCode.USER_NOT_FOUND]: {
    statusCode: 404,
    message: "사용자를 찾을 수 없습니다",
  },
  [ErrorCode.INVALID_CREDENTIALS]: {
    statusCode: 401,
    message: "이메일 또는 비밀번호가 올바르지 않습니다",
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    statusCode: 401,
    message: "토큰이 만료되었습니다",
  },
  [ErrorCode.INVALID_TOKEN]: {
    statusCode: 401,
    message: "유효하지 않은 토큰입니다",
  },
  [ErrorCode.REFRESH_TOKEN_NOT_FOUND]: {
    statusCode: 404,
    message: "리프레시 토큰을 찾을 수 없습니다",
  },

  // 데이터 검증
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    statusCode: 400,
    message: "필수 항목이 누락되었습니다",
  },
  [ErrorCode.INVALID_INPUT]: {
    statusCode: 400,
    message: "입력값이 올바르지 않습니다",
  },
};
