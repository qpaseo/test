import { Module } from '@nestjs/common';
import { CreateController } from './create.controller';
import { CreateService } from './create.service';

import { Supabase } from 'src/Supabase/db/Supabase';

@Module({
  controllers: [CreateController], 
  providers: [CreateService, Supabase],
})
export class CreateModule {}
