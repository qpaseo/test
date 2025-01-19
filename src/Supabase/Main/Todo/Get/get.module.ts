import { Module } from '@nestjs/common';
import { GetController } from './get.controller';
import { GetService } from './get.service';

import { Supabase } from '../../../db/Supabase';

@Module({
  controllers: [GetController],
  providers: [GetService, Supabase],
})
export class GetModule {}
