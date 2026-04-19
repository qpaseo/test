import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger/swagger.spec";
import { ENV } from "./config/env";

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
const isSwaggerEnabled = process.env.SWAGGER_ENABLED === "true";
if (isSwaggerEnabled) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("Swagger 문서: http://localhost:" + ENV.PORT + "/api-docs");
}

export default app;
