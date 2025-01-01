import { Module } from '@nestjs/common';
import { UpdateController } from './update.controller';
import { UpdateService } from './update.service';
import { Supabase } from 'src/Supabase/db/Supabase';

@Module({
  controllers: [UpdateController],
  providers: [UpdateService, Supabase],
})
export class UpdateModule {}