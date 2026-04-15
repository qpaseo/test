import { z } from "zod";

/**
 * 고정 지출 항목
 */
export const ExpenseItemSchema = z.object({
  name: z.string().min(1, "지출 항목명은 필수입니다"),
  money: z.string().regex(/^\d+(\.\d{1,2})?$/, "숫자 형식으로 입력해주세요"),
});

export type ExpenseItem = z.infer<typeof ExpenseItemSchema>;

/**
 * 회원가입 요청 스키마
 */
export const SignUpRequestSchema = z.object({
  name: z
    .string()
    .min(1, "이름은 필수입니다")
    .max(20, "이름은 최대 20자입니다"),
  email: z
    .string()
    .email("유효한 이메일 주소가 아닙니다")
    .max(320, "이메일은 최대 320자입니다"),
  password: z
    .string()
    .min(7, "비밀번호는 최소 7자 이상이어야 합니다")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "비밀번호는 특수문자를 포함해야 합니다",
    ),
  targetAmount: z.number().positive("목표 금액은 0보다 커야 합니다"),
  netMonthlyIncome: z.number().positive("세후 월급은 0보다 커야 합니다"),
  monthlyFixedExpenses: z.array(ExpenseItemSchema),
  hasLoan: z.boolean(),
  hasStock: z.boolean(),
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

/**
 * 로그인 요청 스키마
 */
export const LoginRequestSchema = z.object({
  email: z.string().email("유효한 이메일 주소가 아닙니다"),
  password: z.string().min(1, "비밀번호는 필수입니다"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * 토큰 리프레시 요청 스키마
 */
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, "리프레시 토큰은 필수입니다"),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

/**
 * 로그아웃 요청 스키마
 */
export const LogoutRequestSchema = z.object({
  refreshToken: z.string().min(1, "리프레시 토큰은 필수입니다"),
});

export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
