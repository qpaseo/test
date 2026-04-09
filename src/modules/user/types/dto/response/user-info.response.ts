//유저 정보 응답
export interface UserInfoResponse {
  userId: string;
  email: string;
  name: string;
  hasLoan: boolean;
  hasStock: boolean;
  recentPlanDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
