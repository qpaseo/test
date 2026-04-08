import bcrypt from "bcrypt";
import { AppError, ErrorCode } from "../errors/AppError";

const SALT_ROUNDS = 10;

/**
 * 비밀번호 해싱
 * @param password 평문 비밀번호
 * @returns 해시된 비밀번호
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "비밀번호 암호화 중 오류가 발생했습니다",
    );
  }
};

/**
 * 비밀번호 검증
 * @param password 평문 비밀번호
 * @param hashedPassword 해시된 비밀번호
 * @returns 일치 여부
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "비밀번호 검증 중 오류가 발생했습니다",
    );
  }
};

/**
 * 비밀번호 형식 검증
 * 최소 7자 이상, 특수문자 포함
 * @param password 검증할 비밀번호
 * @returns 유효성 여부
 */
export const validatePasswordFormat = (password: string): boolean => {
  const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{7,})/;
  return passwordRegex.test(password);
};

/**
 * 비밀번호 형식 검증 상세
 * @param password 검증할 비밀번호
 * @throws AppError
 */
export const validatePasswordFormatStrict = (password: string): void => {
  if (!password || password.length < 7) {
    throw new AppError(
      ErrorCode.INVALID_PASSWORD_FORMAT,
      "비밀번호는 최소 7자 이상이어야 합니다",
    );
  }

  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (!hasSpecialChar) {
    throw new AppError(
      ErrorCode.INVALID_PASSWORD_FORMAT,
      "비밀번호는 특수문자를 포함해야 합니다",
    );
  }
};
