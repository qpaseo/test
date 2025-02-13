import { Module } from '@nestjs/common';
import { UpdateController } from './update.controller';
import { UpdateService } from './update.service';
import { Umunjeong_Database } from '../../db/Umunjeong_Database';

@Module({
  controllers: [UpdateController],
  providers: [UpdateService, Umunjeong_Database],
})
export class UpdateModule {}
