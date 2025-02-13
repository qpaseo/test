import { Module } from '@nestjs/common';
import { DeleteController } from './delete.controller';
import { DeleteService } from './delete.service';

import { Umunjeong_Database } from '../../db/Umunjeong_Database';

@Module({
  controllers: [DeleteController],
  providers: [DeleteService, Umunjeong_Database],
})
export class DeleteModule {}
