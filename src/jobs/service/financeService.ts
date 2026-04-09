import { getDatabase } from "../../config/db/db";
import {
  FinancialStatement,
  ExpenseItem,
} from "../../modules/financial/types/financialStatement";
import { RowDataPacket } from "mysql2/promise";

/**
 * 특정 날짜 기준으로 모든 유저의 월별 재무 정보를 업데이트
 * 1) financial_statements에서 유니크한 user_id 조회
 * 2) 각 유저의 최신 financial statement 조회
 * 3) 월별 고정 지출 합산 후 monthly_finances 테이블에 삽입
 * @param date 업데이트 기준 날짜
 */
export async function runMonthlyFinancesUpdate(date: Date) {
  const db = getDatabase();

  // 1) DISTINCT user_id 가져오기
  const [usersRows] = await db.query<RowDataPacket[]>(
    "SELECT DISTINCT user_id FROM financial_statements",
  );
  const users = usersRows as { user_id: string }[];

  for (const user of users) {
    // 2) 최신 financial statement 가져오기
    const [fsRows] = await db.query<RowDataPacket[]>(
      "SELECT net_monthly_income, monthly_fixed_expenses FROM financial_statements WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [user.user_id],
    );

    if (!fsRows[0]) continue;

    const latestFS: FinancialStatement = {
      id: "", // 여기선 ID 필요 없으므로 빈 문자열
      userId: user.user_id,
      netMonthlyIncome: fsRows[0].net_monthly_income,
      monthlyFixedExpenses: fsRows[0].monthly_fixed_expenses
        ? (JSON.parse(fsRows[0].monthly_fixed_expenses) as ExpenseItem[])
        : null,
      monthlySavingsInvestment: null,
      createdAt: new Date(),
      updatedAt: null,
    };

    // 3) 월별 고정 지출 합산
    const totalExpense =
      latestFS.monthlyFixedExpenses?.reduce(
        (sum, item) => sum + Number(item.money),
        0,
      ) || 0;

    // 4) monthly_finances 테이블에 삽입
    await db.query(
      `INSERT INTO monthly_finances 
       (id, user_id, year, month, income, expense, created_at, updated_at)
       VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        latestFS.userId,
        date.getFullYear(),
        date.getMonth() + 1,
        Number(latestFS.netMonthlyIncome),
        totalExpense,
      ],
    );
  }
}
