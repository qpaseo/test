import { Module } from '@nestjs/common';

import { CreateModule } from './Create/create.module';
import { GetModule } from './Get/get.module';
import { DeleteModule } from './Delete/delete.module';
import { UpdateModule } from './Update/update.module';

@Module({
  imports: [CreateModule, GetModule, DeleteModule, UpdateModule],
})
export class FieldModule {}
