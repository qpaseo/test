import { Module } from '@nestjs/common';
import { GetController } from './get.controller';
import { GetService } from './get.service';

import { Umunjeong_Database } from '../../../db/Umunjeong_Database';
import { Umun_Auth_Database } from '../../../db/Umun_Auth_Database'

@Module({
  controllers: [GetController],
  providers: [GetService, Umunjeong_Database,Umun_Auth_Database],
})
export class GetModule {}
