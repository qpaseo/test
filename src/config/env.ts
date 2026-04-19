import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number.parseInt(process.env.PORT || "3000", 10),

  // Database - PostgreSQL
  PG_HOST: process.env.PG_HOST || "localhost",
  PG_PORT: Number.parseInt(process.env.PG_PORT || "5432", 10),
  PG_USER: process.env.PG_USER || "postgres",
  PG_PASSWORD: process.env.PG_PASSWORD || "",
  PG_NAME: process.env.PG_NAME || "ragdb",
  DATABASE_URL: process.env.DATABASE_URL,

  // Redis
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number.parseInt(process.env.REDIS_PORT || "11233", 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  REDIS_DB: Number.parseInt(process.env.REDIS_DB || "0", 10),

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY,

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

  // Swagger
  SWAGGER_ENABLED: process.env.SWAGGER_ENABLED,
};

// 환경 변수 검증
export const validateEnv = () => {
  const requiredEnvVars = [
    "DB_HOST",
    "DB_USER",
    "DB_NAME",
    "REDIS_HOST",
    "REDIS_PASSWORD",
    "JWT_SECRET",
    "OPENAI_API_KEY",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    console.warn(
      `⚠️  Missing environment variables: ${missingEnvVars.join(", ")}`,
    );
  }
};
