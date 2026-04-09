import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../../common/middlewares/authMiddleware";

const router = Router();

/**
 * POST /auth/sign-up
 * 회원가입
 */
router.post("/sign-up", (req, res) => AuthController.signUp(req, res));

/**
 * POST /auth/login
 * 로그인
 */
router.post("/login", (req, res) => AuthController.login(req, res));

/**
 * GET /auth/user
 * 사용자 정보 조회 (인증 필요)
 */
router.get("/user", authMiddleware, (req, res) =>
  AuthController.getUserInfo(req, res),
);

/**
 * POST /auth/refresh
 * 토큰 리프레시
 */
router.post("/refresh", (req, res) => AuthController.refreshToken(req, res));

/**
 * POST /auth/logout
 * 로그아웃
 */
router.post("/logout", (req, res) => AuthController.logout(req, res));

export default router;
