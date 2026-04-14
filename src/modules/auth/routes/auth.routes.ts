import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRoutes {
  constructor(private readonly authController: AuthController) {}
  authRoutes = Router();

  build(): Router {
    const router = Router();

    /**
     * POST /auth/sign-up
     * 회원가입
     */
    router.post("/sign-up", this.authController.signUp);

    /**
     * POST /auth/login
     * 로그인
     */
    router.post("/login", this.authController.login);

    /**
     * POST /auth/refresh
     * 토큰 리프레시
     */
    router.post("/refresh", this.authController.refreshToken);

    /**
     * POST /auth/logout
     * 로그아웃
     */
    router.post("/logout", this.authController.logout);

    return router;
  }
}
