import bcrypt from "bcrypt";
import { AppError, ErrorCode } from "../errors/app.error";

const SALT_ROUNDS = 10;

export interface IPasswordManager {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  validatePasswordFormat(password: string): boolean;
  validatePasswordFormatStrict(password: string): void;
}

export class PasswordManager implements IPasswordManager {
  /**
   * 비밀번호 해싱
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS);
    } catch {
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "비밀번호 암호화 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * 비밀번호 검증
   */
  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch {
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "비밀번호 검증 중 오류가 발생했습니다",
      );
    }
  }

  /**
   * 비밀번호 형식 검증 (단순)
   */
  validatePasswordFormat(password: string): boolean {
    const passwordRegex =
      /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{7,})/;

    return passwordRegex.test(password);
  }

  /**
   * 비밀번호 형식 검증
   */
  validatePasswordFormatStrict(password: string): void {
    if (!password || password.length < 7) {
      throw new AppError(
        ErrorCode.INVALID_PASSWORD_FORMAT,
        "비밀번호는 최소 7자 이상이어야 합니다",
      );
    }

    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    if (!hasSpecialChar) {
      throw new AppError(
        ErrorCode.INVALID_PASSWORD_FORMAT,
        "비밀번호는 특수문자를 포함해야 합니다",
      );
    }
  }
}
