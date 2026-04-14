import { Response } from "express";
import {
  ChatRoomDetailResponse,
  ChatRoomListResponse,
  GetChatRoomsResponse,
} from "../types/dto/response/chat-rooms.response";

export interface IChatService {
  getRagChatRooms(userId: string): Promise<GetChatRoomsResponse[]>;
  getRoomList(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<ChatRoomListResponse>;
  getRoomDetail(
    roomId: string,
    userId: string,
  ): Promise<ChatRoomDetailResponse>;
  deleteRoom(roomId: string, userId: string): Promise<void>;
  streamChat(
    roomId: string,
    userId: string,
    userMessage: string,
    res: Response,
  ): Promise<void>;
}
