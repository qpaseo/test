import mysql from "mysql2/promise";
import { ENV } from "./env";

let pool: mysql.Pool;
/**
 * 데이터베이스 연결 풀 초기화
 */
export const initializeDatabase = async (): Promise<mysql.Pool> => {
  try {
    // 첫 번째 연결: 데이터베이스 연결 여부 확인
    console.log("데이터베이스 존재 여부 확인 중");
    const adminConnection = await mysql.createConnection({
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      user: ENV.DB_USER,
      password: ENV.DB_PASSWORD,
    });

    await adminConnection.end();

    // 두 번째 연결: 실제 데이터베이스에 연결
    pool = mysql.createPool({
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      user: ENV.DB_USER,
      password: ENV.DB_PASSWORD,
      database: ENV.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
    });

    // 연결 테스트
    const connection = await pool.getConnection();
    console.log("MySQL Database 연결 성공");

    connection.release();

    return pool;
  } catch (error) {
    console.error("데이터베이스 연결 실패:", error);
    throw error;
  }
};

/**
 * 데이터베이스 있는지 없는지 조회
 */
export const getDatabase = (): mysql.Pool => {
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
