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
