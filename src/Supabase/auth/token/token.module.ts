import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { Umun_Auth_Database } from '../../db/Umun_Auth_Database';

@Module({
  controllers: [TokenController],
  providers: [TokenService, Umun_Auth_Database],
})
export class TokenModule {}
