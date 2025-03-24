// app.module.ts
import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisModule } from '@nestjs-modules/ioredis'; // Redis
import { ConfigModule } from '@nestjs/config';
import { RateLimitService } from './middleware/function/RateLimitService';
import { GetUserEmail } from './middleware/firebase/getUserEmail';
import { FirebaseModule } from './firebase/firebase.module';
import { MiddlewareModule } from './middleware/middleware.module'; // RredisModule 사용

@Module({
  imports: [
    MiddlewareModule, // RredisModule을 임포트
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    RedisModule,
  ],
  providers: [RateLimitService, GetUserEmail, Redis, RedisModule], // 필요한 provider 등록
})
export class AppModule {}
