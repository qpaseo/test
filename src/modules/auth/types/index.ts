import { Request } from "express";

/**
 * 확장된 Request 타입 (인증 정보 포함)
 */
export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  tokenId?: string;
}

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
 * 회원가입 응답
 */
export interface SignUpResponse {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  userId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

/**
 * 토큰 리프레시 응답
 */
export interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpiresIn: string;
}

/**
 * 사용자 정보 응답
 */
export interface UserInfoResponse {
  userId: string;
  email: string;
  name: string;
  hasLoan: boolean;
  hasStock: boolean;
  recentPlanDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 로그아웃 응답
 */
export interface LogoutResponse {
  message: string;
  timestamp: string;
}
