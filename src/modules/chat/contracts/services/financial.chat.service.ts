import { Response } from "express";
import { FsChatCompleteResponse } from "../types/dto/response/financial-chat-complete.response";
import { FsChatRoomWithLastMessage } from "../types/dto/response/financial-chat-last-message.response";
import { FsChatRoomDetailResponse } from "../types/dto/response/financial-chat-room-detail.response";
import { FsChatRoomListResponse } from "../types/dto/response/financial-chat-room-list.response";

export interface IFsChatService {
  getFinancialChatRoomsWithLastMessage(
    userId: string,
  ): Promise<FsChatRoomWithLastMessage[]>;

  getRoomList(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<FsChatRoomListResponse>;

  getRoomDetail(
    roomId: string,
    userId: string,
  ): Promise<FsChatRoomDetailResponse>;

  streamChat(
    roomId: string,
    userId: string,
    userMessage: string,
    res: Response,
  ): Promise<void>;

  completeAndCreateStatement(
    roomId: string,
    userId: string,
  ): Promise<FsChatCompleteResponse>;
}
