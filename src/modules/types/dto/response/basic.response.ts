import { Request } from "express";

/**
 * API 응답 기본 형식
 */
export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  details?: any;
  timestamp: string;
}

/**
 * 확장된 Request 타입 (인증 정보 포함)
 */
export interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
  tokenId?: string;
}
