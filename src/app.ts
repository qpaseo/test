import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger/swaggerSpec";
import { ENV } from "./config/env";
import authRoutes from "./auth/routes/authRoutes";
import { AppError, ErrorCode } from "./common/errors/AppError";
import { ApiResponse } from "./auth/types/index";

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

// ============= 헬스 체크 =============
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ============= 404 핸들러 =============
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    code: ErrorCode.NOT_FOUND,
    message: "요청한 리소스를 찾을 수 없습니다",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
});

// ============= 글로벌 에러 핸들러 =============
app.use(
  (
    error: Error | AppError,
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction,
  ) => {
    console.error("Global error handler:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 예상치 못한 에러
    res.status(500).json({
      success: false,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "내부 서버 오류가 발생했습니다",
      timestamp: new Date().toISOString(),
    });
  },
);

export default app;
