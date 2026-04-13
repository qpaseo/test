import { Router } from "express";
import { Pool } from "pg";
import { authMiddleware } from "../../../common/middlewares/authMiddleware";
import { FsChatController } from "../controllers/financialChatController";

export function createFsChatRouter(db: Pool): Router {
  const router = Router();
  const controller = new FsChatController(db);

  /**
   * @swagger
   * /api/fs-chat/rooms:
   *   get:
   *     summary: 재무재표 채팅방 리스트 조회
   *     tags: [FsChat]
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
   * /api/fs-chat/rooms/{roomId}:
   *   get:
   *     summary: 재무재표 채팅방 상세 조회 (메세지 포함)
   *     tags: [FsChat]
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
   * /api/fs-chat/stream:
   *   post:
   *     summary: 재무재표 채팅 SSE 스트리밍
   *     description: |
   *       SSE 이벤트 종류:
   *       - `event: message` → 일반 텍스트 응답 `{ chunk: "..." }`
   *       - `event: statement` → 재무재표 업데이트 `{ statement: { ... } }`
   *       - `data: [DONE]` → 스트림 종료
   *     tags: [FsChat]
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
   *               roomId:
   *                 type: string
   *                 format: uuid
   *                 description: 없으면 신규 생성
   *     responses:
   *       200:
   *         description: SSE 스트림 (text/event-stream)
   */
  router.post("/stream", authMiddleware, controller.streamChat);

  /**
   * @swagger
   * /api/fs-chat/rooms/{roomId}/complete:
   *   post:
   *     summary: 재무재표 채팅 완료 및 재무재표 생성
   *     description: |
   *       대화를 종료하고 재무재표를 생성합니다.
   *       - 유저당 최대 2개 유지 (초과 시 오래된 것 삭제)
   *       - 채팅방 메세지 삭제 (방은 유지)
   *       - 새로 생성된 재무재표 반환
   *     tags: [FsChat]
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
   *         description: 생성된 재무재표 반환
   */
  router.post(
    "/rooms/:roomId/complete",
    authMiddleware,
    controller.completeChat,
  );

  return router;
}
