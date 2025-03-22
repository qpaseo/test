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
  Get,
  Query,
} from '@nestjs/common';
import { FirebaseService } from '../../db/firebase';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './create/dto/create-post.dto';
import { DeletePostDto } from './delete/dto/delete-post.dto';
import { UpdatePostDto } from './update/dto/update-post.dto';

import { CreatePostService } from './create/create-post.service';
import { DeletePostService } from './delete/delete-post.service';
import { UpdatePostService } from './update/update-post.service';
import { GetPostsService } from './get/get-post.service';

@Controller('writing')
export class WritingController {
  constructor(
    private readonly firebaseService: FirebaseService,

    private readonly createPostServerice: CreatePostService,
    private readonly deletePostServerice: DeletePostService,
    private readonly updatePostServerice: UpdatePostService,
    private readonly getPostsService: GetPostsService,
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
    return await this.createPostServerice.create(createPostDto, imageUrl);
  }

  @Patch('update')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: any,
  ) {
    //업로드
    const imageUrl = await this.firebaseService.uploadFile(file);
    //업데이트
    return await this.updatePostServerice.update(updatePostDto, imageUrl);
  }

  @Delete('delete')
  async deletePost(@Body() deletePostDto: DeletePostDto) {
    //삭제
    return await this.deletePostServerice.delete(deletePostDto);
  }

  @Get('getall')
  async getPostsByEmail(@Query('email') email: string) {
    if (!email) {
      throw new Error('Email parameter is required');
    }
    return await this.getPostsService.findPostsByEmail(email);
  }
}
