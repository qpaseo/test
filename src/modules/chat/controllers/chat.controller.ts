//일반 채팅방 리스트 조회 (패이지 네이션)
//일반 채팅방 id조회 (모든 정보와 메세지 조회)
//일반 채팅방 chat (sse)
//일반 채팅방 삭제 (메세지랑 메모리 삭제)

import { Response } from "express";
import { handleAuthError } from "../../../common/errors/handle.auth.error";
import { AuthenticatedRequest } from "../../types/dto/response/basic.response";
import {
  ChatMessageBodySchema,
  ChatRoomListQuerySchema,
  ChatRoomParamsSchema,
  CreateChatRoomBodySchema,
  UpdateChatRoomBodySchema,
} from "../validators/chat.validator";
import { IChatController } from "../contracts/controllers/chat.controller";
import { IChatService } from "../contracts/services/chat.service";

export class ChatController implements IChatController {
  constructor(private readonly chatService: IChatService) {}

  getRoomList = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { page, pageSize } = ChatRoomListQuerySchema.parse(req.query);

      const result = await this.chatService.getRoomList(userId, page, pageSize);

      res.status(200).json({
        success: true,
        code: "CHAT_ROOMS_RETRIEVED",
        message: "조회 완료",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  getRoomDetail = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { roomId } = ChatRoomParamsSchema.parse(req.params);

      const result = await this.chatService.getRoomDetail(roomId, userId);

      res.status(200).json({
        success: true,
        code: "CHAT_ROOM_RETRIEVED",
        message: "조회 완료",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  streamChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { message, roomId } = ChatMessageBodySchema.parse(req.body);

      await this.chatService.streamChat(userId, message, res, roomId);
    } catch (error) {
      if (!res.headersSent) {
        handleAuthError(error, res);
      } else {
        res.write(`data: ${JSON.stringify({ error: "stream error" })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      }
    }
  };

  createRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { firstMessage } = CreateChatRoomBodySchema.parse(req.body);

      const roomId = await this.chatService.createRoom(userId, firstMessage);

      res.status(201).json({
        success: true,
        code: "CHAT_ROOM_CREATED",
        message: "채팅방 생성 완료",
        data: { roomId },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  updateRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { roomId } = ChatRoomParamsSchema.parse(req.params);
      const body = UpdateChatRoomBodySchema.parse(req.body);

      await this.chatService.updateRoom(roomId, userId, body);

      res.status(200).json({
        success: true,
        code: "CHAT_ROOM_UPDATED",
        message: "수정 완료",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  deleteRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { roomId } = ChatRoomParamsSchema.parse(req.params);

      await this.chatService.deleteRoom(roomId, userId);

      res.status(200).json({
        success: true,
        code: "CHAT_ROOM_DELETED",
        message: "삭제 완료",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };
}
