import { UserRepository } from "../../user/repositories/userRepository";
import { SignUpRequest, LoginRequest } from "../validators/authValidator";
import { LoginResponse, SignUpResponse } from "../types";
import {
  hashPassword,
  validatePasswordFormatStrict,
  verifyPassword,
} from "../../../common/utils/passwordUtil";
import { AppError, ErrorCode } from "../../../common/errors/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from "../../../common/utils/tokenManager";
import { UserService } from "../../user/services/userService";
import { FinancialService } from "../../financial/services/FinancialService";
import { FinancialChatRoomRepository } from "../../chat/repositories/financialChatRepository";
import { UserInfoResponse } from "../../user/types/dto/response/user-info.response";

/**
 * Auth Service
 * 회원가입, 로그인 등의 비즈니스 로직 처리
 */
export class AuthService {
  /**
   * 회원가입
   * 1. 사용자 정보 입력
   * 2. users 테이블에 저장
   * 3. user_memories 생성
   * 4. financial_goals 생성
   * 5. financial_statements 생성
   */
  static async signUp(input: SignUpRequest): Promise<SignUpResponse> {
    validatePasswordFormatStrict(input.password);

    const existingUser = await UserService.getUserByEmail(input.email);
    if (existingUser) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS, "...", 409);
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await UserService.createUser({
      ...input,
      password: hashedPassword,
    });

    await UserService.initializeUserProfile(user.id, input);
    await FinancialService.initialize(user.id, input);
    await FinancialChatRoomRepository.createFinancialStatementChatRoom(user.id);

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    };
  }
  /**
   * 로그인
   */
  static async login(input: LoginRequest): Promise<LoginResponse> {
    // 사용자 조회
    const user = await UserRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        "이메일 또는 비밀번호가 올바르지 않습니다",
        401,
      );
    }

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        "이메일 또는 비밀번호가 올바르지 않습니다",
        401,
      );
    }

    // 토큰 생성
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id, user.email);

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      accessToken,
      refreshToken,
      accessTokenExpiresIn: "1h",
      refreshTokenExpiresIn: "5d",
    };
  }

  /**
   * 토큰 페이로드로부터 사용자 정보 조회
   */
  static async getUserInfoFromToken(
    tokenPayload: TokenPayload,
  ): Promise<UserInfoResponse> {
    return UserService.getUserById(tokenPayload.userId);
  }
}
