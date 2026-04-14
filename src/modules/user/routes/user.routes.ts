import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { IUserController } from "../contracts/user.controller";

export const createUserRouter = (userController: IUserController): Router => {
  const router = Router();

  router.get("/user", authMiddleware, userController.getUserInfo);

  return router;
};
