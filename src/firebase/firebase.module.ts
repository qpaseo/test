import { Module } from '@nestjs/common';
import { FirebaseService } from '../db/firebase';
import { WritingModule } from './writing/writing.module';
import { ToeknModule } from './token/token.module';

@Module({
  imports: [WritingModule, ToeknModule],
  providers: [FirebaseService],
})
export class FirebaseModule {}
