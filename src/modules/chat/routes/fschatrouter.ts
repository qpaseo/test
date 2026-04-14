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
     * GET /api/fs-chat/rooms
     */
    router.get("/rooms", this.authMiddleware.auth, this.controller.getRoomList);

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
     */
    router.post(
      "/rooms/:roomId/complete",
      this.authMiddleware.auth,
      this.controller.completeChat,
    );

    return router;
  }
}
