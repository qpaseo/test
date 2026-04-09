import { Router } from "express";
import { AuthController } from "../controllers/authController";

const authRoutes = Router();

/**
 * POST /auth/sign-up
 * 회원가입
 */
authRoutes.post("/sign-up", (req, res) => AuthController.signUp(req, res));

/**
 * POST /auth/login
 * 로그인
 */
authRoutes.post("/login", (req, res) => AuthController.login(req, res));

/**
 * POST /auth/refresh
 * 토큰 리프레시
 */
authRoutes.post("/refresh", (req, res) =>
  AuthController.refreshToken(req, res),
);

/**
 * POST /auth/logout
 * 로그아웃
 */
authRoutes.post("/logout", (req, res) => AuthController.logout(req, res));

export default authRoutes;
