/**
 * 커스텀 에러 클래스
 * Java의 Exception 처럼 모든 에러를 이곳에서 관리합니다.
 * * [HTTP Status Code Guide]
 * - 400 (Bad Request): 잘못된 요청 (INVALID_INPUT, MISSING_REQUIRED_FIELD 등)
 * - 401 (Unauthorized): 인증 실패 (INVALID_CREDENTIALS, TOKEN_EXPIRED 등)
 * - 403 (Forbidden): 권한 없음 (FORBIDDEN)
 * - 404 (Not Found): 리소스 없음 (USER_NOT_FOUND, NOT_FOUND 등)
 * - 409 (Conflict): 데이터 충돌 (USER_ALREADY_EXISTS, CONFLICT)
 * - 500 (Internal Server Error): 서버 내부 오류 (INTERNAL_SERVER_ERROR)
 */

export enum ErrorCode {
  // --- 공통 ---
  /** 내부 서버 오류 (500: 알 수 없는 서버 내부 장애) */
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",

  /** 잘못된 요청 (400: 파라미터 누락, 구문 오류 등) */
  BAD_REQUEST = "BAD_REQUEST",

  /** 인증 필요 (401: 로그인이 필요한 서비스) */
  UNAUTHORIZED = "UNAUTHORIZED",

  /** 권한 부족 (403: 로그인했으나 접근 권한이 없음) */
  FORBIDDEN = "FORBIDDEN",

  /** 리소스 없음 (404: 요청한 데이터를 찾을 수 없음) */
  NOT_FOUND = "NOT_FOUND",

  /** 요청 충돌 (409: 중복 데이터 존재 등 상태 충돌) */
  CONFLICT = "CONFLICT",

  // --- 인증 관련 ---
  /** 이메일 형식 오류 (400: 올바르지 않은 이메일 주소 체계) */
  INVALID_EMAIL_FORMAT = "INVALID_EMAIL_FORMAT",

  /** 비밀번호 형식 오류 (400: 최소 7자 이상, 특수문자 포함 미준수) */
  INVALID_PASSWORD_FORMAT = "INVALID_PASSWORD_FORMAT",

  /** 가입된 사용자 존재 (409: 이미 동일한 이메일로 가입됨) */
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",

  /** 사용자 없음 (404: 존재하지 않는 계정) */
  USER_NOT_FOUND = "USER_NOT_FOUND",

  /** 로그인 정보 불일치 (401: 이메일 또는 비밀번호 틀림) */
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

  /** 토큰 만료 (401: 액세스 토큰 시간이 종료됨) */
  TOKEN_EXPIRED = "TOKEN_EXPIRED",

  /** 유효하지 않은 토큰 (401: 조작되었거나 서명이 일치하지 않는 토큰) */
  INVALID_TOKEN = "INVALID_TOKEN",

  /** 리프레시 토큰 누락 (404: DB나 쿠키에 해당 토큰이 없음) */
  REFRESH_TOKEN_NOT_FOUND = "REFRESH_TOKEN_NOT_FOUND",

  // --- 데이터 검증 ---
  /** 필수 필드 누락 (400: 필요한 데이터 값이 비어 있음) */
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  /** 입력값 유효성 검사 실패 (400: 데이터 타입이나 포맷이 틀림) */
  INVALID_INPUT = "INVALID_INPUT",
}

interface ErrorResponse {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
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
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * 팩토리 메서드: ERROR_MAP을 참조하여 에러 객체 생성
   */
  static fromCode(
    code: ErrorCode,
    details?: Record<string, any>,
    customMessage?: string,
  ): AppError {
    const config = ERROR_MAP[code];

    // 만약 ERROR_MAP에 정의되지 않은 코드가 들어올 경우를 대비한 방어 코드
    const message =
      customMessage || config?.message || "알 수 없는 오류가 발생했습니다.";
    const statusCode = config?.statusCode || 500;

    return new AppError(code, message, statusCode, details);
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
