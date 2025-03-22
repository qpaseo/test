import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RateLimitMiddleware } from './middleware/RateLimitMiddleware';
import { RredisModule } from './middleware/middleware.module';
import { RateLimitService } from './middleware/function/RateLimitService';

import { Get_User_Id } from './middleware/firebase/Get_User_ID';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    RredisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
  ],
  providers: [RateLimitService, Get_User_Id],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
