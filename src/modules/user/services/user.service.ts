import { AppError, ErrorCode } from "../../../common/errors/app.error";
import { UserMemoryContent } from "../types/entity/user-memory.entity";
import { UserInfoResponse } from "../types/dto/response/user-info.response";
import { CreateUserInput } from "../types/internal";
import { UserRepository } from "../repositories/user.repository";
import { UserMemoryRepository } from "../repositories/user-memory.repository";
import { IUserService } from "../contracts/service/user.service";

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMemoryRepository: UserMemoryRepository,
  ) {}

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async getUserById(userId: string): Promise<UserInfoResponse> {
    const userRow = await this.userRepository.findById(userId);

    if (!userRow) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        "사용자를 찾을 수 없습니다",
        404,
      );
    }

    return this.mapToUserInfo(userRow);
  }

  async createUser(input: {
    name: string;
    email: string;
    password: string;
    hasLoan: boolean;
    hasStock: boolean;
  }): Promise<UserInfoResponse> {
    const createUserInput: CreateUserInput = {
      name: input.name,
      email: input.email,
      password: input.password,
      has_loan: input.hasLoan,
      has_stock: input.hasStock,
    };

    const userRow = await this.userRepository.create(createUserInput);

    return this.mapToUserInfo(userRow);
  }

  async initializeUserProfile(
    userId: string,
    input: {
      name: string;
      targetAmount: number;
      netMonthlyIncome: number;
      hasLoan: boolean;
      hasStock: boolean;
    },
  ) {
    const importantInfo = this.buildImportantInfo(
      input.hasLoan,
      input.hasStock,
    );

    const memoryContent: UserMemoryContent = {
      memory: `${input.name}님의 기본 재무 정보: 목표금액 ${input.targetAmount}, 월 수입 ${input.netMonthlyIncome}`,
      important_information: importantInfo,
    };

    await this.userMemoryRepository.createUserMemory(userId, memoryContent);
  }

  private mapToUserInfo(userRow: any): UserInfoResponse {
    return {
      userId: userRow.id,
      name: userRow.name,
      email: userRow.email,
      hasLoan: userRow.has_loan,
      hasStock: userRow.has_stock,
      recentPlanDate: userRow.recent_plan_date
        ? new Date(userRow.recent_plan_date)
        : null,
      createdAt: new Date(userRow.created_at),
      updatedAt: new Date(userRow.updated_at),
    };
  }

  private buildImportantInfo(hasLoan: boolean, hasStock: boolean): string {
    return [
      hasLoan
        ? "- 대출 진행중 → 고급 경제 설명 필요"
        : "- 대출 없음 → 기초 경제 설명 필요",

      hasStock
        ? "- 주식 투자 경험 있음 → 심화 설명"
        : "- 주식 경험 없음 → 기초부터 설명",
    ].join("\n");
  }
}
