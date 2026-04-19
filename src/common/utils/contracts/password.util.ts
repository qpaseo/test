export interface IPasswordManager {
  /**
   * 비밀번호 해싱
   */
  hashPassword(password: string): Promise<string>;

  /**
   * 비밀번호 검증
   */
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;

  /**
   * 비밀번호 형식 검증 (단순)
   */
  validatePasswordFormat(password: string): boolean;

  /**
   * 비밀번호 형식 검증 (엄격)
   */
  validatePasswordFormatStrict(password: string): void;
}
