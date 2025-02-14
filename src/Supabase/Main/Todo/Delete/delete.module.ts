import { Module } from '@nestjs/common';
import { DeleteController } from './delete.controller';
import { DeleteService } from './delete.service';

import { Umunjeong_Database } from '../../../db/Umunjeong_Database';
import { Umun_Auth_Database } from '../../../db/Umun_Auth_Database';

@Module({
  controllers: [DeleteController],
  providers: [DeleteService, Umunjeong_Database, Umun_Auth_Database],
})
export class DeleteModule {}
