import { v4 as uuidv4 } from "uuid";
import {
  UserRepository,
  CreateUserInput,
} from "../repositories/userRepository";
import { UserMemoryRepository } from "../repositories/userMemoryRepository";
import { AppError, ErrorCode } from "../../../common/errors/AppError";
import { UserMemoryContent } from "../types/entity/user-memory.entity";
import { User } from "../types/entity/user.entity";

export class UserService {
  /**
   * 이메일로 유저 조회
   */
  static async getUserByEmail(email: string) {
    return UserRepository.findByEmail(email);
  }

  /**
   * ID로 유저 조회
   */
  static async getUserById(userId: string): Promise<User> {
    const userRow = await UserRepository.findById(userId);

    if (!userRow) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        "사용자를 찾을 수 없습니다",
        404,
      );
    }

    return {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      password: userRow.password,
      has_loan: userRow.has_loan,
      has_stock: userRow.has_stock,
      recent_plan_date: userRow.recent_plan_date
        ? new Date(userRow.recent_plan_date)
        : null,
      created_at: new Date(userRow.created_at),
      updated_at: new Date(userRow.updated_at),
    };
  }
  /**
   * 유저 생성
   */
  static async createUser(input: {
    name: string;
    email: string;
    password: string;
    hasLoan: boolean;
    hasStock: boolean;
  }) {
    const userId = uuidv4();

    const createUserInput: CreateUserInput = {
      id: userId,
      name: input.name,
      email: input.email,
      password: input.password,
      has_loan: input.hasLoan,
      has_stock: input.hasStock,
    };

    return UserRepository.create(createUserInput);
  }

  /**
   * 회원가입 후 유저 초기 데이터 세팅
   */
  static async initializeUserProfile(
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

    await UserMemoryRepository.createUserMemory(userId, memoryContent);
  }

  /**
   * 중요 정보 생성
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
