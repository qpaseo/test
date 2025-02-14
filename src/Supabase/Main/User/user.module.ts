import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { Umun_Auth_Database } from '../../db/Umun_Auth_Database';

@Module({
  controllers: [UserController],
  providers: [UserService, Umun_Auth_Database],
})
export class UserModule {}
