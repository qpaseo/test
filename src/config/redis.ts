import { createClient, RedisClientType } from "redis";
import { ENV } from "./env";

let redisClient: RedisClientType;

export const initializeRedis = async (): Promise<RedisClientType> => {
  try {
    redisClient = createClient({
      // host, port는 여기서 바로 쓰지 않고 socket 안으로
      socket: {
        host: ENV.REDIS_HOST,
        port: ENV.REDIS_PORT,
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
      password: ENV.REDIS_PASSWORD,
      database: ENV.REDIS_DB,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis connected");
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error("Redis connection failed:", error);
    throw error;
  }
};

export const getRedis = (): RedisClientType => {
  if (!redisClient) {
    throw new Error("Redis not initialized. Call initializeRedis first.");
  }
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.log("Redis connection closed");
  }
};
