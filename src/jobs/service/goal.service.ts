// services/goalService.ts
import { getDatabase } from "../../config/db/db";

/**
 * 특정 날짜 기준으로 모든 유저의 재무 목표 진행도 업데이트
 * 1) financial_goals에서 모든 row 조회
 * 2) current_amount에 monthly_contribution 더하기
 * @param date 업데이트 기준 날짜
 */
export async function runMonthlyGoalUpdate() {
  const db = getDatabase();

  await db.query(
    `UPDATE financial_goals
     SET 
       current_amount = current_amount + monthly_contribution,
       updated_at = NOW()
     WHERE monthly_contribution > 0`,
  );
}
