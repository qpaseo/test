//제무제표 채팅방 리스트 조회 (페이지 네이션)
//재무재표 채팅방 id조회 (모든 정보와 메세지 조회)
//재무재표 채팅방 chat (sse)
//재무재표 chat 끝내고 생성 (메세지 삭제)

import { Response } from "express";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { FsChatService } from "../services/financialChatService";
import {
  ApiResponse,
  AuthenticatedRequest,
} from "../../types/dto/response/basic.response";
import { FsChatRoomListResponse } from "../types/dto/response/financial-chat-room-list.response";
import {
  FsChatMessageBodySchema,
  FsChatRoomListQuerySchema,
  FsChatRoomParamsSchema,
} from "../validators/fschatvalidator";
import { handleAuthError } from "../../../common/errors/HandleAuthError";
import { FsChatRoomDetailResponse } from "../types/dto/response/financial-chat-room-detail.response";
import { FsChatCompleteResponse } from "../types/dto/response/financial-chat-complete.response";

export class FsChatController {
  private readonly fsChatService: FsChatService;

  constructor(db: Pool) {
    this.fsChatService = new FsChatService(db);
  }

  // 재무재표 채팅방 리스트 조회 (페이지네이션)
  getRoomList = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<FsChatRoomListResponse>>,
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const { page, pageSize } = FsChatRoomListQuerySchema.parse(req.query);

      const result = await this.fsChatService.getRoomList(
        userId,
        page,
        pageSize,
      );

      res.status(200).json({
        success: true,
        code: "FS_CHAT_ROOMS_RETRIEVED",
        message: "재무재표 채팅방 리스트가 성공적으로 조회되었습니다.",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  // 재무재표 채팅방 상세 조회
  getRoomDetail = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<FsChatRoomDetailResponse>>,
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const parsed = FsChatRoomParamsSchema.parse(req.params);

      const result = await this.fsChatService.getRoomDetail(
        parsed.roomId,
        userId,
      );

      res.status(200).json({
        success: true,
        code: "FS_CHAT_ROOM_RETRIEVED",
        message: "재무재표 채팅방 정보가 성공적으로 조회되었습니다.",
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
      const { message, roomId } = FsChatMessageBodySchema.parse(req.body);

      const targetRoomId = roomId ?? uuidv4();

      await this.fsChatService.streamChat(targetRoomId, userId, message, res);
    } catch (error) {
      if (res.headersSent === false) {
        handleAuthError(error, res);
      } else {
        res.write(
          `event: message\ndata: ${JSON.stringify({
            error: "스트리밍 중 오류가 발생했습니다.",
          })}\n\n`,
        );
        res.write("data: [DONE]\n\n");
        res.end();
      }
    }
  };

  // 재무재표 생성
  completeChat = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<FsChatCompleteResponse>>,
  ): Promise<void> => {
    try {
      const userId = req.userId!;

      const { roomId } = FsChatRoomParamsSchema.parse(req.params);

      const result = await this.fsChatService.completeAndCreateStatement(
        roomId,
        userId,
      );

      res.status(200).json({
        success: true,
        code: "FS_STATEMENT_CREATED",
        message: "재무재표가 성공적으로 생성되었습니다.",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };
}
