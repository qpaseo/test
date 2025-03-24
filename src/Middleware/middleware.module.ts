// middleware.module.ts (이전의 RredisModule 대신 사용)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisClientProvider } from './redis/redis';
import { RateLimitMiddleware } from './RateLimitMiddleware';
import { GetUserEmail } from './firebase/getUserEmail';

@Module({
  imports: [ConfigModule], // ConfigModule을 임포트하여 환경변수를 사용할 수 있도록 함
  providers: [RedisClientProvider, RateLimitMiddleware, GetUserEmail],
  exports: [RedisClientProvider, RateLimitMiddleware, GetUserEmail],
})
export class MiddlewareModule {}
