import { Module } from '@nestjs/common';
import { FirebaseService } from '../../db/firebase';
import { AuthRefreshService } from './token-refresh.service';
import { AuthRefreshController } from './token-refresh.controller';

@Module({
  controllers: [AuthRefreshController],
  providers: [AuthRefreshService, FirebaseService],
})
export class ToeknModule {}
