// user.routes.ts

import { Router } from "express";
import { AuthMiddleware } from "../../../common/middlewares/auth.middleware";
import { IUserController } from "../contracts/controller/user.controller";

/**
 * User Routes (DI Version)
 */
export class UserRoutes {
  constructor(
    private readonly userController: IUserController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  build(): Router {
    const router = Router();

    /**
     * GET /user
     * - 인증된 사용자 정보 조회
     * - Access Token 기반으로 사용자 식별
     */
    router.get("/", this.authMiddleware.auth, this.userController.getUserInfo);

    router.get(
      "/main",
      this.authMiddleware.auth,
      this.userController.getUserDashboard,
    );

    return router;
  }
}
