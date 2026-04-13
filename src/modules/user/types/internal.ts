/**
 *  User Repository (파라미터 타입) : 사용자 생성 입력값
 */
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  has_loan: boolean;
  has_stock: boolean;
}
