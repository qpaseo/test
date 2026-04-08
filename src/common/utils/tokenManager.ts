import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../../config/env";
import { getRedis } from "../../config/redis";
import { AppError, ErrorCode } from "../errors/AppError";
import { SignOptions } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  tokenId: string; // 토큰 ID (레디스에서 추적)
}

/**
 * 액세스 토큰 생성
 * @param userId 사용자 ID
 * @param email 사용자 이메일
 * @returns 액세스 토큰
 */
export const generateAccessToken = (userId: string, email: string): string => {
  const tokenId = uuidv4();

  const payload: TokenPayload = {
    userId,
    email,
    tokenId,
    type: "access",
  };

  const token = jwt.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn: ENV.JWT_ACCESS_EXPIRY as SignOptions["expiresIn"],
  });

  return token;
};

/**
 * 리프레시 토큰 생성 및 Redis에 저장
 * @param userId 사용자 ID
 * @param email 사용자 이메일
 * @returns 리프레시 토큰
 */
export const generateRefreshToken = async (
  userId: string,
  email: string,
): Promise<string> => {
  const tokenId = uuidv4();

  const payload: TokenPayload = {
    userId,
    email,
    tokenId,
    type: "refresh",
  };

  const token = jwt.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn: ENV.JWT_ACCESS_EXPIRY as SignOptions["expiresIn"],
  });

  // Redis에 리프레시 토큰 저장 (5일)
  const redis = getRedis();
  const refreshTokenKey = `refresh_token:${userId}:${tokenId}`;
  const ttl = 5 * 24 * 60 * 60; // 5일

  await redis.set(refreshTokenKey, token, {
    EX: ttl,
  });

  return token;
};

/**
 * 토큰 검증
 * @param token 검증할 토큰
 * @returns 토큰 페이로드
 * @throws AppError
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(ErrorCode.TOKEN_EXPIRED, "토큰이 만료되었습니다", 401);
    }
    throw new AppError(
      ErrorCode.INVALID_TOKEN,
      "유효하지 않은 토큰입니다",
      401,
    );
  }
};

/**
 * 리프레시 토큰 검증 및 확인
 * @param token 검증할 리프레시 토큰
 * @returns 토큰 페이로드
 * @throws AppError
 */
export const verifyRefreshToken = async (
  token: string,
): Promise<TokenPayload> => {
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;

    // Redis에서 토큰 존재 확인
    const redis = getRedis();
    const refreshTokenKey = `refresh_token:${decoded.userId}:${decoded.tokenId}`;
    const storedToken = await redis.get(refreshTokenKey);

    if (!storedToken) {
      throw new AppError(
        ErrorCode.REFRESH_TOKEN_NOT_FOUND,
        "리프레시 토큰을 찾을 수 없습니다",
        404,
      );
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        ErrorCode.TOKEN_EXPIRED,
        "리프레시 토큰이 만료되었습니다",
        401,
      );
    }
    throw new AppError(
      ErrorCode.INVALID_TOKEN,
      "유효하지 않은 리프레시 토큰입니다",
      401,
    );
  }
};

/**
 * 리프레시 토큰 삭제 (로그아웃)
 * @param userId 사용자 ID
 * @param tokenId 토큰 ID
 */
export const deleteRefreshToken = async (
  userId: string,
  tokenId: string,
): Promise<void> => {
  const redis = getRedis();
  const refreshTokenKey = `refresh_token:${userId}:${tokenId}`;
  await redis.del(refreshTokenKey);
};

/**
 * 사용자의 모든 리프레시 토큰 삭제 (로그아웃 from all devices)
 * @param userId 사용자 ID
 */
export const deleteAllRefreshTokens = async (userId: string): Promise<void> => {
  const redis = getRedis();
  const pattern = `refresh_token:${userId}:*`;
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(keys);
  }
};

/**
 * 액세스 토큰 재발급
 * @param refreshToken 리프레시 토큰
 * @returns 새 액세스 토큰
 */
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<string> => {
  const decoded = await verifyRefreshToken(refreshToken);
  return generateAccessToken(decoded.userId, decoded.email);
};
