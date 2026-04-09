
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
 * 로그아웃 응답
 */
export interface LogoutResponse {
  message: string;
  timestamp: string;
}
