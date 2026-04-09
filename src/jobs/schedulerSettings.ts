// services/schedulerService.ts

import { RowDataPacket } from "mysql2";
import { getDatabase } from "../config/db";
import { SchedulerSettings } from "../config/db/types/schedulerSettings";

/**
 * DB에서 마지막 스케줄러 실행 날짜(last_run_date)를 가져옵니다.
 * @returns 마지막 실행 날짜를 Date 객체로 반환
 * @throws 스케줄러 설정이 초기화되지 않은 경우 에러 발생
 */
export async function getLastRunDate(): Promise<Date> {
  const db = getDatabase();

  const [rows] = await db.query<SchedulerSettings[]>(
    "SELECT last_run_date FROM scheduler_settings LIMIT 1",
  );

  if (!rows[0]) throw new Error("Scheduler settings not initialized");

  return new Date(rows[0].last_run_date);
}

/**
 * 스케줄러 마지막 실행 날짜(last_run_date)를 DB에 업데이트합니다.
 * @param date 업데이트할 날짜(Date 객체)
 */
export async function updateLastRunDate(date: Date) {
  const db = getDatabase();

  await db.query("UPDATE scheduler_settings SET last_run_date = ?", [date]);
}

/**
 * 스케줄러 설정이 없는 경우 초기 last_run_date를 DB에 삽입합니다.
 * @param initialDate 초기 날짜(Date 객체)
 */
export async function initLastRunDate(initialDate: Date) {
  const db = getDatabase();

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS cnt FROM scheduler_settings",
  );

  const cnt = (rows[0] as any).cnt as number;

  if (cnt === 0) {
    await db.query(
      "INSERT INTO scheduler_settings (last_run_date) VALUES (?)",
      [initialDate],
    );
  }
}
