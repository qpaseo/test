import { FsChatRoomSummaryResponse } from "./financial-chat-room-summary.response";

export interface FsChatRoomListResponse {
  rooms: FsChatRoomSummaryResponse[];
  total: number;
  page: number;
  pageSize: number;
}
