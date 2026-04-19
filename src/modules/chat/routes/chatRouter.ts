// chat.routes.ts

import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { AuthMiddleware } from "../../../common/middlewares/auth.middleware";

/**
 * Chat Routes (DI Version)
 */
export class ChatRoutes {
  constructor(
    private readonly chatController: ChatController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  build(): Router {
    const router = Router();

    /**
     * GET /chat/rooms
     */
    router.get(
      "/rooms",
      this.authMiddleware.auth,
      this.chatController.getRoomList,
    );

    /**
     * GET /chat/rooms/:roomId
     */
    router.get(
      "/rooms/:roomId",
      this.authMiddleware.auth,
      this.chatController.getRoomDetail,
    );

    /**
     * POST /chat/rooms/:roomId
     */
    router.post(
      "/rooms/create",
      this.authMiddleware.auth,
      this.chatController.createRoom,
    );

    /**
     * PATCH /chat/rooms/:roomId
     */
    router.patch(
      "/rooms/:roomId",
      this.authMiddleware.auth,
      this.chatController.updateRoom,
    );

    /**
     * DELETE /chat/rooms/:roomId
     */
    router.delete(
      "/rooms/:roomId",
      this.authMiddleware.auth,
      this.chatController.deleteRoom,
    );

    /**
     * POST /chat/stream
     */
    router.post(
      "/stream",
      this.authMiddleware.auth,
      this.chatController.streamChat,
    );

    return router;
  }
}
