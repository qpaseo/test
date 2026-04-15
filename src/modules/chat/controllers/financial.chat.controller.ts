//제무제표 채팅방 리스트 조회 (페이지 네이션)
//재무재표 채팅방 id조회 (모든 정보와 메세지 조회)
//재무재표 채팅방 chat (sse)
//재무재표 chat 끝내고 생성 (메세지 삭제)

import { Response } from "express";
import { AuthenticatedRequest } from "../../types/dto/response/basic.response";
import {
  FsChatMessageBodySchema,
  FsChatRoomParamsSchema,
  FsChatRoomUpdateParamsSchema,
} from "../validators/fschat.validator";
import { handleAuthError } from "../../../common/errors/handle.auth.error";
import { IIdGenerator } from "../../../common/utils/contracts/uuid.generator.util";
import { IFsChatService } from "../contracts/services/financial.chat.service";
import { IFsChatController } from "../contracts/controllers/financial.chat.controller";

export class FsChatController implements IFsChatController {
  constructor(
    private readonly fsChatService: IFsChatService,
    private readonly idGenerator: IIdGenerator,
  ) {}

  // getRoomList = async (req: AuthenticatedRequest, res: Response) => {
  //   try {
  //     const userId = req.userId!;
  //     const { page, pageSize } = FsChatRoomListQuerySchema.parse(req.query);

  //     const result = await this.fsChatService.getRoomList(
  //       userId,
  //       page,
  //       pageSize,
  //     );

  //     res.status(200).json({
  //       success: true,
  //       code: "FS_CHAT_ROOMS_RETRIEVED",
  //       message: "조회 완료",
  //       data: result,
  //       timestamp: new Date().toISOString(),
  //     });
  //   } catch (error) {
  //     handleAuthError(error, res);
  //   }
  // };

  getRoomDetail = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { roomId } = FsChatRoomParamsSchema.parse(req.params);

      const result = await this.fsChatService.getRoomDetail(roomId, userId);

      res.status(200).json({
        success: true,
        code: "FS_CHAT_ROOM_RETRIEVED",
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
      const { message, roomId } = FsChatMessageBodySchema.parse(req.body);

      const targetRoomId = roomId ?? this.idGenerator.generate();

      await this.fsChatService.streamChat(targetRoomId, userId, message, res);
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  completeChat = async (req: AuthenticatedRequest, res: Response) => {
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
        message: "생성 완료",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  updateRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { roomId } = FsChatRoomParamsSchema.parse(req.params);

      const { name, description } = FsChatRoomUpdateParamsSchema.parse(
        req.body,
      );

      const result = await this.fsChatService.updateRoom(roomId, userId, {
        name,
        description,
      });

      res.status(200).json({
        success: true,
        code: "FS_CHAT_ROOM_UPDATED",
        message: "수정 완료",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };
}
