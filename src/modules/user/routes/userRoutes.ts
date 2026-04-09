import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/authMiddleware";
import { UserController } from "../controllers/userController";

const router = Router();

/**
 * GET /auth/user
 * 사용자 정보 조회 (인증 필요)
 */
router.get("/user", authMiddleware, (req, res) =>
  UserController.getUserInfo(req, res),
);

export default router;
