import { UserInfoResponse } from "../../types/dto/response/user-info.response";

export interface IUserService {
  getUserByEmail(email: string): Promise<any>;

  getUserById(userId: string): Promise<UserInfoResponse>;

  createUser(input: {
    name: string;
    email: string;
    password: string;
    hasLoan: boolean;
    hasStock: boolean;
  }): Promise<UserInfoResponse>;

  initializeUserProfile(
    userId: string,
    input: {
      name: string;
      targetAmount: number;
      netMonthlyIncome: number;
      hasLoan: boolean;
      hasStock: boolean;
    },
  ): Promise<void>;
}
