import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

//supabase모듈
import { Umun_Auth_Database } from './Supabase/db/Umun_Auth_Database';
import { Umunjeong_Database } from './Supabase/db/Umunjeong_Database';

//다른 모듈
import { AuthModule } from './Supabase/auth/auth.module';
import { TodoModule } from './Supabase/Main/Todo/todo.module';
import { FieldModule } from './Supabase/Field/field.module';
import { PinModule } from './Supabase/Pin/pin.module';

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
    PinModule,
  ],
  controllers: [],
  providers: [
    Umun_Auth_Database,
    Umunjeong_Database,
    RateLimitService,
    Get_User_Id,
  ],
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
          path: 'token/Issuance',
          method: RequestMethod.POST,
        },
        {
          path: 'token/check',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*'); // 나머지 모든 경로(+모든 요청)에 대해 미들웨어를 적용
  }
}
