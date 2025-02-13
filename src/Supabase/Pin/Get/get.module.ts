import { Module } from '@nestjs/common';
import { GetController } from './get.controller';
import { GetService } from './get.service';

import { Umunjeong_Database } from '../../db/Umunjeong_Database';

@Module({
  controllers: [GetController],
  providers: [GetService, Umunjeong_Database],
})
export class GetModule {}
