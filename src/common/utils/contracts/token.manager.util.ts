import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  tokenId: string; // 토큰 ID (레디스에서 추적)
}

export interface ITokenManager {
  generateAccessToken(userId: string, email: string): string;

  generateRefreshToken(userId: string, email: string): Promise<string>;

  verifyToken(token: string): TokenPayload;

  verifyRefreshToken(token: string): Promise<TokenPayload>;

  refreshAccessToken(refreshToken: string): Promise<string>;

  deleteRefreshToken(userId: string, tokenId: string): Promise<void>;

  deleteAllRefreshTokens(userId: string): Promise<void>;
}
