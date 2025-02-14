import { Module } from '@nestjs/common';
import { CreateController } from './create.controller';
import { CreateService } from './create.service';

import { Umunjeong_Database } from '../../../db/Umunjeong_Database';
import { Umun_Auth_Database } from '../../../db/Umun_Auth_Database'

@Module({
  controllers: [CreateController], 
  providers: [CreateService, Umunjeong_Database,Umun_Auth_Database],
})
export class CreateModule {}
