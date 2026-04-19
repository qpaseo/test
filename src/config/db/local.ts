// db 로컬로 연결할때 사용하는 코드입니다.

import { Pool } from "pg";
import { ENV } from "../../config/env";

let pool: Pool;

/**
 * 데이터베이스 연결 풀 초기화
 */
export const initializeDatabase = async (): Promise<Pool> => {
  try {
    console.log("데이터베이스 존재 여부 확인 중");

    // 연결 테스트용 임시 연결
    const testPool = new Pool({
      host: ENV.PG_HOST,
      port: ENV.PG_PORT,
      user: ENV.PG_USER,
      password: ENV.PG_PASSWORD,
      database: ENV.PG_NAME,
    });

    const client = await testPool.connect();
    client.release();
    await testPool.end();

    // 실제 사용할 풀 생성
    pool = new Pool({
      host: ENV.PG_HOST,
      port: ENV.PG_PORT,
      user: ENV.PG_USER,
      password: ENV.PG_PASSWORD,
      database: ENV.PG_NAME,
      max: 10, // connectionLimit 대응
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // 연결 테스트
    const connection = await pool.connect();
    console.log("PostgreSQL Database 연결 성공");
    connection.release();

    return pool;
  } catch (error) {
    console.error("데이터베이스 연결 실패:", error);
    throw error;
  }
};

/**
 * 데이터베이스 풀 반환
 */
export const getDatabase = (): Pool => {
  if (!pool) {
    throw new Error("데이터베이스가 초기화되지 않았습니다.");
  }
  return pool;
};

/**
 * 데이터베이스 연결 종료
 */
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    console.log("데이터베이스 연결 종료");
  }
};
