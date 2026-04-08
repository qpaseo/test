export interface UserMemoryContent {
  memory: string;
  important_information: string;
}

export interface UserMemory {
  id: string;
  user_id: string;
  content: UserMemoryContent; // JSON 구조 반영
  created_at: Date;
  updated_at: Date;
}
