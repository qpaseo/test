//일반 채팅방 리스트 조회 (패이지 네이션)
//일반 채팅방 id조회 (모든 정보와 메세지 조회)
//일반 채팅방 chat (sse)
//일반 채팅방 삭제 (메세지랑 메모리 삭제)

import { Response } from "express";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { ChatService } from "../services/chatService";
import { handleAuthError } from "../../../common/errors/HandleAuthError";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../types/dto/response/basic.response";
import {
  ChatRoomDetailResponse,
  ChatRoomListResponse,
} from "../types/dto/response/chat-rooms.response";
import {
  ChatMessageBodySchema,
  ChatRoomListQuerySchema,
} from "../validators/chatvalidator";

export class ChatController {
  private chatService: ChatService;

  constructor(db: Pool) {
    this.chatService = new ChatService(db);
  }

  // 채팅방 리스트 조회
  getRoomList = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<ChatRoomListResponse>>,
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const { page, pageSize } = ChatRoomListQuerySchema.parse(req.query);

      const result = await this.chatService.getRoomList(userId, page, pageSize);

      res.status(200).json({
        success: true,
        code: "CHAT_ROOMS_RETRIEVED",
        message: "채팅방 리스트가 성공적으로 조회되었습니다.",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  // 채팅방 상세 조회
  getRoomDetail = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<ChatRoomDetailResponse>>,
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const { roomId } = req.params;

      const result = await this.chatService.getRoomDetail(roomId, userId);

      res.status(200).json({
        success: true,
        code: "CHAT_ROOM_RETRIEVED",
        message: "채팅방 정보가 성공적으로 조회되었습니다.",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  // SSE 채팅
  streamChat = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const { message, roomId } = ChatMessageBodySchema.parse(req.body);

      const targetRoomId = roomId ?? uuidv4();

      await this.chatService.streamChat(targetRoomId, userId, message, res);
    } catch (error) {
      if (!res.headersSent) {
        handleAuthError(error, res);
      } else {
        res.write(
          `data: ${JSON.stringify({
            error: "스트리밍 중 오류가 발생했습니다.",
          })}\n\n`,
        );
        res.write("data: [DONE]\n\n");
        res.end();
      }
    }
  };

  // 채팅방 삭제
  deleteRoom = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<null>>,
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const { roomId } = req.params;

      await this.chatService.deleteRoom(roomId, userId);

      res.status(200).json({
        success: true,
        code: "CHAT_ROOM_DELETED",
        message: "채팅방이 성공적으로 삭제되었습니다.",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };
}
