// runMonthlyFinancesUpdate와 cron 설정

import cron from "node-cron";
import { runMonthlyFinancesUpdate } from "./service/finance.service";
import {
  getLastRunDate,
  updateLastRunDate,
  initLastRunDate,
} from "./scheduler.settings";
import { runMonthlyGoalUpdate } from "./service/goal.service";

/**
 * 월별 재무 업데이트 스케줄러 초기화
 * 1) 초기값 세팅
 * 2) 서버 시작 시 누락된 날짜 처리
 * 3) 매일 00:00 cron으로 정기 실행
 */
export async function initMonthlyFinancesJob() {
  // 1) 초기값 생성 (DB에 스케줄러 설정이 없으면 오늘 날짜로 초기화)
  await initLastRunDate(new Date());

  // 2) 서버 시작 시 누락된 날짜 처리
  const lastRunDate = await getLastRunDate(); // 마지막 실행 날짜 조회
  const today = new Date();

  //1달에 1번 실행 보장
  let dateToRun = new Date(lastRunDate);
  while (
    dateToRun.getFullYear() < today.getFullYear() ||
    (dateToRun.getFullYear() === today.getFullYear() &&
      dateToRun.getMonth() < today.getMonth())
  ) {
    await runMonthlyFinancesUpdate(dateToRun);
    await runMonthlyGoalUpdate();
    // 다음 달로 증가
    dateToRun.setMonth(dateToRun.getMonth() + 1);
  }

  // 오늘 날짜로 마지막 실행일 업데이트
  await updateLastRunDate(today);

  // 3) 서버가 켜져 있는 동안 매일 00:00 정기 실행(cron)
  cron.schedule("0 0 * * *", async () => {
    const now = new Date();
    await runMonthlyFinancesUpdate(now); // 오늘 날짜 기준 월별 재무 업데이트
    await updateLastRunDate(now); // 마지막 실행일 갱신
  });
}
