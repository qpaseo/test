import { Response } from "express";
import { FsChatRoomWithLastMessage } from "../../types/dto/response/financial-chat-last-message.response";
//import { FsChatRoomListResponse } from "../../types/dto/response/financial-chat-room-list.response";
import { FsChatRoomDetailResponse } from "../../types/dto/response/financial-chat-room-detail.response";
import { FsChatCompleteResponse } from "../../types/dto/response/financial-chat-complete.response";
import { FinancialStatementInput } from "../../../financial/types/dto/request/financial-statement.create.request";

export interface IFsChatService {
  getFinancialChatRoomsWithLastMessage(
    userId: string,
  ): Promise<FsChatRoomWithLastMessage[]>;

  // getRoomList(
  //   userId: string,
  //   page: number,
  //   pageSize: number,
  // ): Promise<FsChatRoomListResponse>;

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
    input: FinancialStatementInput,
  ): Promise<FsChatCompleteResponse>;

  updateRoom(
    roomId: string,
    userId: string,
    input: { name?: string; description?: string | null },
  ): Promise<any>;

  updateMyLatestStatement(userId: string, input: any): Promise<any>;
}
