import { Router } from "express";
import { Pool } from "pg";
import { ConceptRepository } from "../repositories/concepts.repository";
import { ConceptService } from "../services/concept.service";
import { ConceptController } from "../controllers/concept.controller";

export function createConceptRouter(pool: Pool): Router {
  const router = Router();

  const repository = new ConceptRepository(pool);
  const service = new ConceptService(repository);
  const controller = new ConceptController(service);

  /**
   * @swagger
   * /concepts:
   *   get:
   *     summary: 컨셉 리스트 조회 (페이지네이션 12개)
   *     tags: [Concepts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: 페이지 번호 (1부터 시작)
   *     responses:
   *       200:
   *         description: 컨셉 리스트 반환
   *       401:
   *         description: 인증 실패
   */
  router.get("/", authMiddleware, controller.getConceptList);

  /**
   * @swagger
   * /concepts/{id}:
   *   get:
   *     summary: 컨셉 상세 조회
   *     tags: [Concepts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 컨셉 UUID
   *     responses:
   *       200:
   *         description: 컨셉 상세 반환
   *       400:
   *         description: 유효하지 않은 UUID
   *       401:
   *         description: 인증 실패
   *       404:
   *         description: 컨셉 없음
   */
  router.get("/:id", authMiddleware, controller.getConceptById);

  return router;
}
