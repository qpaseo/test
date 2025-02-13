import { Module } from '@nestjs/common';
import { CreateController } from './create.controller';
import { CreateService } from './create.service';

import { Umunjeong_Database } from '../../db/Umunjeong_Database';

@Module({
  controllers: [CreateController],
  providers: [CreateService, Umunjeong_Database],
})
export class CreateModule {}
