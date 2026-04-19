import { Response } from "express";
import { AuthenticatedRequest } from "../../types/dto/response/basic.response";
import {
  FsChatMessageBodySchema,
  FsChatRoomParamsSchema,
  FsChatRoomUpdateParamsSchema,
  FsProposalParamsSchema,
  FsDraftParamsSchema,
  FinancialStatementInputSchema,
} from "../validators/fschat.validator";
import { handleAuthError } from "../../../common/errors/handle.auth.error";
import { IIdGenerator } from "../../../common/utils/contracts/uuid.generator.util";
import { IFsChatService } from "../contracts/services/financial.chat.service";
import { IFsChatController } from "../contracts/controllers/financial.chat.controller";
import { FsDraftService } from "../services/financial.draft.service";
import { ExpenseItem } from "../../financial/types/entity/financial-statement.entity";

export class FsChatController implements IFsChatController {
  constructor(
    private readonly fsChatService: IFsChatService,
    private readonly fsDraftService: FsDraftService,
    private readonly idGenerator: IIdGenerator,
  ) {}

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

      // 추가된 부분
      const input = FinancialStatementInputSchema.parse(req.body);

      const result = await this.fsChatService.completeAndCreateStatement(
        roomId,
        userId,
        input,
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

  updateLatestStatement = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;

      const input = req.body as {
        net_monthly_income?: number;
        monthly_fixed_expenses?: ExpenseItem[] | null;
        monthly_savings_investment?: ExpenseItem[] | null;
      };

      const result = await this.fsChatService.updateMyLatestStatement(
        userId,
        input,
      );

      res.status(200).json({
        success: true,
        code: "FS_STATEMENT_UPDATED",
        message: "최신 재무재표 수정 완료",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  // ─── Proposal ────────────────────────────────────────

  getPendingProposals = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { draftId } = FsDraftParamsSchema.parse(req.params);
      const result = await this.fsDraftService.getPendingProposals(draftId);

      res.status(200).json({
        success: true,
        code: "FS_PROPOSALS_RETRIEVED",
        message: "조회 완료",
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  acceptProposal = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { proposalId } = FsProposalParamsSchema.parse(req.params);

      await this.fsDraftService.acceptProposal(proposalId, userId);

      res.status(200).json({
        success: true,
        code: "FS_PROPOSAL_ACCEPTED",
        message: "수락 완료",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };

  rejectProposal = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { proposalId } = FsProposalParamsSchema.parse(req.params);

      await this.fsDraftService.rejectProposal(proposalId, userId);

      res.status(200).json({
        success: true,
        code: "FS_PROPOSAL_REJECTED",
        message: "거절 완료",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleAuthError(error, res);
    }
  };
}
