import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger/swaggerSpec";
import { ENV } from "./config/env";
import { ErrorCode } from "./common/errors/AppError";
import authRoutes from "./modules/auth/routes/authRoutes";
import { ApiResponse } from "./modules/types/dto/response/basic.response";
import userRouter from "./modules/user/routes/userRoutes";
import ragRouter from "./modules/rag/routes/ragRoutes";

const app: Application = express();

// ============= 보안 미들웨어 =============
app.use(helmet());
app.use(cors());

// ============= 로깅 =============
app.use(morgan("combined"));

// ============= 바디 파싱 =============
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ============= Swagger 설정 =============
if (ENV.SWAGGER_ENABLED) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger 문서: http://localhost:" + ENV.PORT + "/api-docs");

  console.log("Swagger 문서: http://localhost:" + ENV.PORT + "/api-docs");
}

// ============= 라우팅 =============
app.use("/auth", authRoutes);
app.use("/user", userRouter);
app.use("/rag", ragRouter);

// ============= 404 핸들러 =============
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    code: ErrorCode.NOT_FOUND,
    message: "요청한 리소스를 찾을 수 없습니다",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
});

export default app;
