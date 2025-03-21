//이메일 까지 받아서 이메일과 제목 일치하면 작동
//gpt 참고해서 코드 수정

import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { WritingService } from './writing.service';
import { CreatePostDto } from './dto/create-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FirebaseService } from '../db/firebase';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('writing')
export class WritingController {
  constructor(
    private readonly writingService: WritingService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file')) // 파일 업로드 처리
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: any,
  ) {
    // 이미지 파일을 Firebase Storage에 업로드
    const imageUrl = await this.firebaseService.uploadFile(file);

    // 게시글 생성
    return await this.writingService.create(createPostDto, imageUrl);
  }

  @Patch('update')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: any,
  ) {
    const imageUrl = await this.firebaseService.uploadFile(file);
    return await this.writingService.update(updatePostDto, imageUrl);
  }

  @Delete('delete')
  async deletePost(@Body() deletePostDto: DeletePostDto) {
    return await this.writingService.delete(deletePostDto);
  }
}
