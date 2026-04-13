import { Router } from "express";
import { Pool } from "pg";
import { ChatController } from "../controllers/chatController";
import { authMiddleware } from "../../../common/middlewares/authMiddleware";

export function createChatRouter(db: Pool): Router {
  const router = Router();
  const controller = new ChatController(db);

  /**
   * @swagger
   * /api/chat/rooms:
   *   get:
   *     summary: 일반 채팅방 리스트 조회
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: 채팅방 리스트 반환
   */
  router.get("/rooms", authMiddleware, controller.getRoomList);

  /**
   * @swagger
   * /api/chat/rooms/{roomId}:
   *   get:
   *     summary: 일반 채팅방 상세 조회 (메세지 + 메모리 포함)
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: 채팅방 상세 정보 반환
   */
  router.get("/rooms/:roomId", authMiddleware, controller.getRoomDetail);

  /**
   * @swagger
   * /api/chat/rooms/{roomId}:
   *   delete:
   *     summary: 일반 채팅방 삭제 (메세지, 메모리 포함)
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: 삭제 성공
   */
  router.delete("/rooms/:roomId", authMiddleware, controller.deleteRoom);

  /**
   * @swagger
   * /api/chat/stream:
   *   post:
   *     summary: 일반 채팅 SSE 스트리밍
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - message
   *             properties:
   *               message:
   *                 type: string
   *                 description: 유저 메세지
   *               roomId:
   *                 type: string
   *                 format: uuid
   *                 description: 채팅방 ID (없으면 신규 생성)
   *     responses:
   *       200:
   *         description: SSE 스트림 (text/event-stream)
   */
  router.post("/stream", authMiddleware, controller.streamChat);

  return router;
}
