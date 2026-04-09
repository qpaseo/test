import { RowDataPacket } from "mysql2";

export interface UserMemoryContent {
  memory: string;
  important_information: string;
}

/**
 * DBd의 구조인 테이블 로우 타입
 */
export interface UserMemory {
  id: string;
  user_id: string;
  content: UserMemoryContent; // JSON 구조 반영
  created_at: Date;
  updated_at: Date;
}

/**
 * DB에서 직접 조회했을 때의 유저 메모리 로우 타입
 */
export interface UserMemoryRow extends RowDataPacket {
  id: string;
  user_id: string;
  content: string; // DB에는 문자열로 저장됨
  created_at: Date;
  updated_at: Date;
}
