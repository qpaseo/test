// services/schedulerService.ts
import { getDatabase } from "../config/db/db";
import { SchedulerSettings } from "../config/db/types/scheduler.settings";

/**
 * DB에서 마지막 스케줄러 실행 날짜(last_run_date)를 가져옵니다.
 */
export async function getLastRunDate(): Promise<Date> {
  const db = getDatabase();

  const result = await db.query<SchedulerSettings>(
    "SELECT last_run_date FROM scheduler_settings LIMIT 1",
  );

  if (!result.rows[0]) throw new Error("Scheduler settings not initialized");

  return new Date(result.rows[0].last_run_date);
}

/**
 * 스케줄러 마지막 실행 날짜(last_run_date)를 DB에 업데이트합니다.
 */
export async function updateLastRunDate(date: Date) {
  const db = getDatabase();

  await db.query("UPDATE scheduler_settings SET last_run_date = $1", [date]);
}

/**
 * 스케줄러 설정이 없는 경우 초기 last_run_date를 DB에 삽입합니다.
 */
export async function initLastRunDate(initialDate: Date) {
  const db = getDatabase();

  const result = await db.query<{ cnt: string }>(
    "SELECT COUNT(*) AS cnt FROM scheduler_settings",
  );

  const cnt = parseInt(result.rows[0].cnt, 10);

  if (cnt === 0) {
    await db.query(
      "INSERT INTO scheduler_settings (last_run_date) VALUES ($1)",
      [initialDate],
    );
  }
}
