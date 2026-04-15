import { SignUpRequest, LoginRequest } from "../validators/auth.validator";
import { AppError, ErrorCode } from "../../../common/errors/app.error";
import { UserInfoResponse } from "../../user/types/dto/response/user-info.response";
import { SignUpResponse } from "../types/dto/response/sign-up.response";
import { LoginResponse } from "../types/dto/response/login.response";
import { TokenPayload } from "../../../common/utils/contracts/token.manager.util";
import { IUserService } from "../../user/contracts/service/user.service";
import { IFinancialService } from "../../financial/contracts/service/financial.service";
import { IAuthService } from "../contracts/services/auth.service";
import { TokenManager } from "../../../common/utils/token.manager.util";
import { PasswordManager } from "../../../common/utils/password.util";
import { UserRepository } from "../../user/repositories/user.repository";
import { IFinancialChatRoomRepository } from "../../chat/contracts/repositories/financial.chat.room.repository";

export class AuthService implements IAuthService {
  constructor(
    private readonly userService: IUserService,
    private readonly financialService: IFinancialService,
    private readonly financialChatRoomRepository: IFinancialChatRoomRepository,
    private readonly passwordManager: PasswordManager,
    private readonly tokenManager: TokenManager,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 회원가입
   */
  async signUp(input: SignUpRequest): Promise<SignUpResponse> {
    this.passwordManager.validatePasswordFormatStrict(input.password);

    const existingUser = await this.userService.getUserByEmail(input.email);
    if (existingUser) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS, "...", 409);
    }

    console.log("유저 검증 완료");

    const hashedPassword = await this.passwordManager.hashPassword(
      input.password,
    );

    console.log("비밀번호 검증 완료");

    const user = await this.userService.createUser({
      ...input,
      password: hashedPassword,
    });

    console.log("유저 생성 완료");

    await this.userService.initializeUserProfile(user.userId, input);
    await this.financialService.initialize(user.userId, input);
    await this.financialChatRoomRepository.createFinancialStatementChatRoom(
      user.userId,
    );

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  /**
   * 로그인
   */
  async login(input: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        "이메일 또는 비밀번호가 올바르지 않습니다",
        401,
      );
    }

    const isPasswordValid = await this.passwordManager.verifyPassword(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        "이메일 또는 비밀번호가 올바르지 않습니다",
        401,
      );
    }

    const accessToken = this.tokenManager.generateAccessToken(
      user.id,
      user.email,
    );

    const refreshToken = await this.tokenManager.generateRefreshToken(
      user.id,
      user.email,
    );

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
   * 토큰 페이로드 기반 사용자 조회
   */
  async getUserInfoFromToken(
    tokenPayload: TokenPayload,
  ): Promise<UserInfoResponse> {
    return this.userService.getUserById(tokenPayload.userId);
  }
}
