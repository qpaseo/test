export interface UserMemoryContent {
  memory: string;
  important_information: string;
}

// db 타입
export interface UserMemoryRow {
  id: string;
  user_id: string;
  content: UserMemoryContent;
  created_at: string;
  updated_at: string | null;
}

// 서비스에서 변환
export interface UserMemory {
  id: string;
  userId: string;
  content: UserMemoryContent;
  createdAt: Date;
  updatedAt: Date | null;
}
