import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

//supabase모듈
import { Supabase } from './Supabase/db/Supabase';

//다른 모듈
import { AuthModule } from './Supabase/auth/auth.module';
import { TodoModule } from './Supabase/Main/Todo/todo.module';
import { FieldModule } from './Supabase/Field/field.module';

// 미들웨어
import { RateLimitMiddleware } from './Redis/Middleware/RateLimitMiddleware'; // 미들웨어에서 사용하는 함수
import { RredisModule } from './Redis/redis.module'; // 미들웨어 모듈
import { RateLimitService } from './Redis/Middleware/function/RateLimitService'; // 미들웨어에서 사용하는 서비스
import { Get_User_Id } from './Redis/Middleware/Supabase/Get_User_ID'; // 미들웨어에서 사용하는 함수

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RredisModule,
    AuthModule,
    TodoModule,
    FieldModule,
  ],
  controllers: [],
  providers: [Supabase, RateLimitService, Get_User_Id],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .exclude(
        {
          path: 'auth/signin',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/signup',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/token/',
          method: RequestMethod.GET,
        },
      )
      .forRoutes('*'); // 나머지 모든 경로(+모든 요청)에 대해 미들웨어를 적용
  }
}
