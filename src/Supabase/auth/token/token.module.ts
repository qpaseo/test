import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { Supabase } from '../../db/Supabase';

@Module({
  controllers: [TokenController],
  providers: [TokenService, Supabase],
})
export class TokenModule {}
