//일반 chat 메모리 응답 DTO
export interface ChatMemoryResponse {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  createdAt: Date;
}
