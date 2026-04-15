// tokenManager.ts

import jwt, { SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../../config/env";
import { getRedis } from "../../config/redis";
import { AppError, ErrorCode } from "../errors/app.error";
import { ITokenManager, TokenPayload } from "./contracts/token.manager.util";

export class TokenManager implements ITokenManager {
  /**
   * Access Token 생성
   * - userId와 email을 기반으로 JWT Access Token을 생성한다.
   * - tokenId는 Redis 추적 및 토큰 식별용 고유값이다.
   */
  generateAccessToken(userId: string, email: string): string {
    const tokenId = uuidv4();

    const payload: TokenPayload = {
      userId,
      email,
      tokenId,
      type: "access",
    };

    if (!ENV.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    if (!ENV.JWT_ACCESS_EXPIRY) {
      throw new Error("JWT_ACCESS_EXPIRY not set");
    }

    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_ACCESS_EXPIRY as SignOptions["expiresIn"],
    });
  }

  /**
   * Refresh Token 생성 및 Redis 저장
   * - userId와 email 기반으로 Refresh Token을 생성한다.
   * - 생성된 tokenId 기준으로 Redis에 저장하여 세션을 관리한다.
   * - TTL이 지나면 자동 만료된다.
   */
  async generateRefreshToken(userId: string, email: string): Promise<string> {
    const tokenId = uuidv4();

    const payload: TokenPayload = {
      userId,
      email,
      tokenId,
      type: "refresh",
    };

    if (!ENV.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    if (!ENV.JWT_REFRESH_EXPIRY) {
      throw new Error("JWT_REFRESH_EXPIRY not set");
    }

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_REFRESH_EXPIRY as SignOptions["expiresIn"],
    });

    const redis = getRedis();
    const key = `refresh_token:${userId}:${tokenId}`;
    const ttl = 5 * 24 * 60 * 60;

    await redis.set(key, token, { EX: ttl });

    return token;
  }

  /**
   * JWT 토큰 검증
   * - Access Token 또는 Refresh Token의 서명을 검증한다.
   * - 만료 토큰과 유효하지 않은 토큰을 구분하여 에러를 발생시킨다.
   */
  verifyToken(token: string): TokenPayload {
    try {
      if (!ENV.JWT_SECRET) {
        throw new Error("JWT_SECRET not set");
      }

      return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(ErrorCode.TOKEN_EXPIRED, "토큰 만료", 401);
      }
      throw new AppError(ErrorCode.INVALID_TOKEN, "유효하지 않은 토큰", 401);
    }
  }

  /**
   * Refresh Token 검증
   * - JWT 검증 후 Redis에 실제 저장된 토큰 존재 여부를 확인한다.
   * - Redis에 없으면 폐기된 토큰으로 판단한다.
   */
  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    const decoded = this.verifyToken(token);

    const redis = getRedis();
    const key = `refresh_token:${decoded.userId}:${decoded.tokenId}`;
    const stored = await redis.get(key);

    if (!stored) {
      throw new AppError(
        ErrorCode.REFRESH_TOKEN_NOT_FOUND,
        "리프레시 토큰 없음",
        404,
      );
    }

    return decoded;
  }

  /**
   * Access Token 재발급
   * - Refresh Token 검증 후 새로운 Access Token을 생성한다.
   * - Refresh Token이 유효한 경우에만 실행된다.
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const decoded = await this.verifyRefreshToken(refreshToken);
    return this.generateAccessToken(decoded.userId, decoded.email);
  }

  /**
   * 특정 Refresh Token 삭제 (로그아웃)
   * - userId와 tokenId를 기반으로 Redis에서 해당 토큰을 제거한다.
   * - 해당 디바이스의 세션만 종료된다.
   */
  async deleteRefreshToken(userId: string, tokenId: string): Promise<void> {
    const redis = getRedis();
    await redis.del(`refresh_token:${userId}:${tokenId}`);
  }

  /**
   * 모든 Refresh Token 삭제 (전체 로그아웃)
   * - 해당 userId에 연결된 모든 Refresh Token을 Redis에서 삭제한다.
   * - 모든 디바이스 세션을 종료한다.
   */
  async deleteAllRefreshTokens(userId: string): Promise<void> {
    const redis = getRedis();
    const keys = await redis.keys(`refresh_token:${userId}:*`);

    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
}
