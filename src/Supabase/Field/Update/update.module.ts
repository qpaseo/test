import { Module } from '@nestjs/common';
import { UpdateController } from './update.controller';
import { UpdateService } from './update.service';
import { Umunjeong_Database } from '../../db/Umunjeong_Database';
import { Umun_Auth_Database } from '../../db/Umun_Auth_Database'

@Module({
  controllers: [UpdateController],
  providers: [UpdateService, Umunjeong_Database,Umun_Auth_Database],
})
export class UpdateModule {}
