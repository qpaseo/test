import { Router } from "express";
import { FsChatController } from "../controllers/financial.chat.controller";
import { AuthMiddleware } from "../../../common/middlewares/auth.middleware";

/**
 * Financial Statement Chat Routes (DI Version)
 */
export class FsChatRoutes {
  constructor(
    private readonly controller: FsChatController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  build(): Router {
    const router = Router();

    /**
     * GET /api/fs-chat/rooms/:roomId
     */
    router.get(
      "/rooms/:roomId",
      this.authMiddleware.auth,
      this.controller.getRoomDetail,
    );

    /**
     * POST /api/fs-chat/stream
     */
    router.post(
      "/stream",
      this.authMiddleware.auth,
      this.controller.streamChat,
    );

    /**
     * POST /api/fs-chat/rooms/:roomId/complete
     * (유저 입력 포함해서 재무재표 생성)
     */
    router.post(
      "/rooms/:roomId/complete",
      this.authMiddleware.auth,
      this.controller.completeChat,
    );

    /**
     * PATCH /api/fs-chat/financial-statements/latest
     * (최신 재무재표 직접 수정)
     */
    router.patch(
      "/financial-statements/latest",
      this.authMiddleware.auth,
      this.controller.updateLatestStatement,
    );

    /**
     * proposal 관련
     */
    router.get(
      "/drafts/:draftId/proposals",
      this.authMiddleware.auth,
      this.controller.getPendingProposals,
    );

    router.post(
      "/proposals/:proposalId/accept",
      this.authMiddleware.auth,
      this.controller.acceptProposal,
    );

    router.post(
      "/proposals/:proposalId/reject",
      this.authMiddleware.auth,
      this.controller.rejectProposal,
    );

    return router;
  }
}
