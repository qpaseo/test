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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FirebaseService } from '../../db/firebase';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './create/dto/create-post.dto';
import { DeletePostDto } from './delete/dto/delete-post.dto';
import { UpdatePostDto } from './update/dto/update-post.dto';

import { CreatePostService } from './create/create-post.service';
import { DeletePostService } from './delete/delete-post.service';
import { UpdatePostService } from './update/update-post.service';
import { GetPostsService } from './get/get-post.service';

@ApiTags('게시판')
@Controller('writing')
export class WritingController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly createPostService: CreatePostService,
    private readonly deletePostService: DeletePostService,
    private readonly updatePostService: UpdatePostService,
    private readonly getPostsService: GetPostsService,
  ) {}

  @Post('create')
  @ApiOperation({
    summary: '게시글 생성',
    description: '이메일과 제목 일치 시 작동하며 파일 업로드를 지원합니다.',
  })
  @ApiResponse({ status: 201, description: '게시글 작성 성공' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: any,
  ) {
    const imageUrl = await this.firebaseService.uploadFile(file);
    return await this.createPostService.create(createPostDto, imageUrl);
  }

  @Patch('update')
  @ApiOperation({
    summary: '게시글 수정',
    description: '이메일과 제목 일치 시 작동하며 파일 업로드를 지원합니다.',
  })
  @ApiResponse({ status: 200, description: '게시글 수정 성공' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: any,
  ) {
    const imageUrl = await this.firebaseService.uploadFile(file);
    return await this.updatePostService.update(updatePostDto, imageUrl);
  }

  @Delete('delete')
  @ApiOperation({
    summary: '게시글 삭제',
    description: '이메일과 제목이 일치하는 게시글 삭제',
  })
  @ApiResponse({ status: 200, description: '게시글 삭제 성공' })
  async deletePost(@Body() deletePostDto: DeletePostDto) {
    return await this.deletePostService.delete(deletePostDto);
  }

  @Get('getall')
  @ApiOperation({
    summary: '게시글 조회',
    description: '이메일을 기반으로 게시글을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '게시글 조회 성공' })
  async getPostsByEmail(@Query('email') email: string) {
    if (!email) {
      throw new Error('Email parameter is required');
    }
    return await this.getPostsService.findPostsByEmail(email);
  }
}
