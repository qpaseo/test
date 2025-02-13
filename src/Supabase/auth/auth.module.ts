import { Module } from '@nestjs/common';

// 하위 서비스
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// 하위 모듈
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';

//다른 라이브러리
import { Umun_Auth_Database } from '../db/Umun_Auth_Database';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Umun_Auth_Database, TokenService],
  imports: [TokenModule],
})
export class AuthModule {}
