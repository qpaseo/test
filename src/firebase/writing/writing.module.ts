import { Module } from '@nestjs/common';
import { FirebaseService } from '../../db/firebase';
import { WritingController } from './writing.controller';
import { CreatePostService } from './create/create-post.service';
import { UpdatePostService } from './update/update-post.service';
import { DeletePostService } from './delete/delete-post.service';
import { GetPostsService } from './get/get-post.service';

@Module({
  providers: [
    FirebaseService,
    CreatePostService,
    UpdatePostService,
    DeletePostService,
    GetPostsService,
  ],
  controllers: [WritingController],
})
export class WritingModule {}
