import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RateLimitMiddleware } from './Middleware/RateLimitMiddleware';
import { RredisModule } from './Middleware/redis.module';
import { RateLimitService } from './Middleware/function/RateLimitService';

import { Get_User_Id } from './Middleware/firebase/Get_User_ID';

@Module({
  imports: [
    RredisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [RateLimitService, Get_User_Id],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
