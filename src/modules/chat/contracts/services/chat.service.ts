import { Response } from "express";
import {
  ChatRoomDetailResponse,
  ChatRoomListResponse,
  ChatRoomsResponse,
} from "../../types/dto/response/chat-rooms.response";
import { UpdateChatRoomInput } from "../../types/internal";

export interface IChatService {
  getRagChatRooms(userId: string): Promise<ChatRoomsResponse[]>;
  getRoomList(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<ChatRoomListResponse>;
  getRoomDetail(
    roomId: string,
    userId: string,
  ): Promise<ChatRoomDetailResponse>;
  createRoom(userId: string, firstMessage: string): Promise<string>;
  updateRoom(
    roomId: string,
    userId: string,
    input: UpdateChatRoomInput,
  ): Promise<void>;
  deleteRoom(roomId: string, userId: string): Promise<void>;
  streamChat(
    userId: string,
    userMessage: string,
    res: Response,
    roomId?: string,
  ): Promise<void>;
}
