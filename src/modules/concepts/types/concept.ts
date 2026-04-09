import { RowDataPacket } from "mysql2";

export interface Concept extends RowDataPacket {
  concept_id: string;
  name: string;
  description: string | null;
  content: string;
  // JSON 구조 정의: 키는 숫자(문자열 형태), 값은 문자열
  category: { [key: string]: string } | null;
  document_url: string | null;
  created_at: Date;
  updated_at: Date;
}
