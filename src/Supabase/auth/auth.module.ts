import { Module } from '@nestjs/common';

// 하위 서비스
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// 하위 모듈
import { TokenModule } from './token/token.module';

//다른 라이브러리
import { Supabase } from '../db/Supabase';
import { TokenService } from './token/token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Supabase, TokenService],
  imports: [TokenModule],
})
export class AuthModule {}
