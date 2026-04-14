import { ChatMemoryResponse } from "./chat-memory.response";
import { ChatMessageResponse } from "./chat-message.response";

//대시보드용 마지막 매세지 포함 반환 dto
export interface ChatRoomsResponse {
  id: string;
  name: string;
  description: string | null;
  lastMessage: string | null;
  createdAt: Date;
}

//chat room id, user id 없이 반환하는 일부 요약 dto
export interface ChatRoomSummaryResponse {
  id: string;
  name: string;
  description: string | null;
  memoryCount: number;
  createdAt: Date;
  updatedAt: Date | null;
}

//chat room 관련 정보 포함한 반환 dto (user id 생략)
export interface ChatRoomDetailResponse {
  id: string;
  name: string;
  description: string | null;
  memoryCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  messages: ChatMessageResponse[];
  memories: ChatMemoryResponse[];
}

//chat room 목록 반환 dto (페이징 포함)
export interface ChatRoomListResponse {
  rooms: ChatRoomSummaryResponse[];
  total: number;
  page: number;
  pageSize: number;
}
