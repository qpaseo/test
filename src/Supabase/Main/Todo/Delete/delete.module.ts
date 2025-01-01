import { Module } from '@nestjs/common';
import { DeleteController } from './delete.controller';
import { DeleteService } from './delete.service';

import { Supabase } from 'src/Supabase/db/Supabase';

@Module({
  controllers: [DeleteController],
  providers: [DeleteService, Supabase],
})
export class DeleteModule {}
