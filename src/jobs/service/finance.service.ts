import { getDatabase } from "../../config/db/db";
import {
  FinancialStatement,
  ExpenseItem,
} from "../../modules/financial/types/entity/financial-statement.entity";

export async function runMonthlyFinancesUpdate(date: Date) {
  const db = getDatabase();

  // 1) DISTINCT user_id 가져오기
  const usersResult = await db.query<{ user_id: string }>(
    "SELECT DISTINCT user_id FROM financial_statements",
  );
  const users = usersResult.rows;

  for (const user of users) {
    // 2) 최신 financial statement 가져오기
    const fsResult = await db.query<{
      net_monthly_income: number;
      monthly_fixed_expenses: string;
    }>(
      "SELECT net_monthly_income, monthly_fixed_expenses FROM financial_statements WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [user.user_id],
    );

    if (!fsResult.rows[0]) continue;

    const row = fsResult.rows[0];

    const latestFS: FinancialStatement = {
      id: "",
      userId: user.user_id,
      netMonthlyIncome: row.net_monthly_income,
      monthlyFixedExpenses: row.monthly_fixed_expenses
        ? (row.monthly_fixed_expenses as unknown as ExpenseItem[]) // pg는 JSONB 자동 파싱
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
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())`,
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
