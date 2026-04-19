import { Pool } from "pg";
import { ENV } from "../../config/env";

let pool: Pool;

/**
 * 데이터베이스 연결 풀 초기화
 */
export const initializeDatabase = async (): Promise<Pool> => {
  try {
    console.log("데이터베이스 연결 시도 중");

    pool = new Pool({
      connectionString: ENV.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

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
