import { Module } from '@nestjs/common';
import { FirebaseService } from '../db/firebase';
import { WritingService } from './writing.service';
import { WritingController } from './writing.controller';

@Module({
  providers: [FirebaseService, WritingService],
  controllers: [WritingController],
})
export class FirebaseModule {}
