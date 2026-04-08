import { v4 as uuidv4 } from "uuid";
import {
  UserRepository,
  CreateUserInput,
} from "../repositories/userRepository";
import {
  FinancialRepository,
  UserMemoryContent,
} from "../repositories/financialRepository";
import {
  SignUpRequest,
  LoginRequest,
} from "../validators/authValidator";
import {
  hashPassword,
  verifyPassword,
  validatePasswordFormatStrict,
} from "../../common/utils/passwordUtil";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from "../../common/utils/tokenManager";
import { AppError, ErrorCode } from "../../common/errors/AppError";
import {
  SignUpResponse,
  LoginResponse,
  UserInfoResponse,
} from "../types/index";

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
    // 비밀번호 형식 검증
    validatePasswordFormatStrict(input.password);

    // 이메일 중복 확인
    const existingUser = await UserRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(
        ErrorCode.USER_ALREADY_EXISTS,
        "이미 존재하는 이메일입니다",
        409,
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await hashPassword(input.password);

    // 사용자 생성
    const userId = uuidv4();
    const createUserInput: CreateUserInput = {
      id: userId,
      name: input.name,
      email: input.email,
      password: hashedPassword,
      has_loan: input.hasLoan,
      has_stock: input.hasStock,
    };

    const user = await UserRepository.create(createUserInput);

    // User Memory 생성
    const importantInfo = this.buildImportantInfo(
      input.hasLoan,
      input.hasStock,
    );
    const memoryContent: UserMemoryContent = {
      memory: `${input.name}님의 기본 재무 정보: 목표금액 ${input.targetAmount}, 월 수입 ${input.netMonthlyIncome}`,
      important_information: importantInfo,
    };
    await FinancialRepository.createUserMemory(userId, memoryContent);

    // 고정 지출 총액 계산
    const fixedExpensesTotal = input.monthlyFixedExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.money),
      0,
    );

    // Financial Goal 생성
    // monthly_contribution = netMonthlyIncome - fixedExpensesTotal
    const monthlyContribution = input.netMonthlyIncome - fixedExpensesTotal;

    await FinancialRepository.createFinancialGoal(
      userId,
      input.targetAmount,
      monthlyContribution,
    );

    // Financial Statement 생성
    await FinancialRepository.createFinancialStatement(
      userId,
      input.netMonthlyIncome,
      input.monthlyFixedExpenses,
      fixedExpensesTotal,
    );

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
   * 사용자 정보 조회
   */
  static async getUserInfo(userId: string): Promise<UserInfoResponse> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        "사용자를 찾을 수 없습니다",
        404,
      );
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      hasLoan: user.has_loan,
      hasStock: user.has_stock,
      recentPlanDate: user.recent_plan_date,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  /**
   * 토큰 페이로드로부터 사용자 정보 조회
   */
  static async getUserInfoFromToken(
    tokenPayload: TokenPayload,
  ): Promise<UserInfoResponse> {
    return this.getUserInfo(tokenPayload.userId);
  }

  /**
   * 중요 정보 문자열 생성
   */
  private static buildImportantInfo(
    hasLoan: boolean,
    hasStock: boolean,
  ): string {
    const parts: string[] = [];

    if (hasLoan) {
      parts.push(
        "- 이 유저는 대출을 진행중입니다 경제에 관심이 있고 활동에 옮긴적이 있음을 확인하고 고급적(전문적)인 경제 답변을 해주세요",
      );
    } else {
      parts.push(
        "- 이 유저는 현재 대출을 진행중이 아닙니다 기초적이고 이해하기 쉬운 경제 개념 설명을 해주세요",
      );
    }

    if (hasStock) {
      parts.push(
        "- 이 유저는 주식 투자를 하고 있습니다 주식 관련 질문에는 상세하고 전문적인 답변을 해주세요",
      );
    } else {
      parts.push(
        "- 이 유저는 주식 투자를 하지 않고 있습니다 주식에 대한 기초 개념부터 설명해주세요",
      );
    }

    return parts.join("\n");
  }
}
