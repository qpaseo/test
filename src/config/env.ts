import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),

  // Database - MySQL
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "path_db",

  // Redis
  REDIS_HOST:
    process.env.REDIS_HOST ||
    "redis-11233.c340.ap-northeast-2-1.ec2.cloud.redislabs.com",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "11233", 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  REDIS_DB: parseInt(process.env.REDIS_DB || "0", 10),

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  JWT_ACCESS_EXPIRY: "1h", // 1시간
  JWT_REFRESH_EXPIRY: "5d", // 5일

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

  // Swagger
  SWAGGER_ENABLED: process.env.SWAGGER_ENABLED !== "false",
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
