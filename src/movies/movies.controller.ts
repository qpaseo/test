import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Req,
  Res,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { MoviesService } from './movies.service';
import { Movie } from './entity/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({
    summary: '영화 전부 가져오기',
  })
  getAll(@Req() req: FastifyRequest, @Res() res: FastifyReply): void {
    // req 클라가 서버한테, res서버가 클라한테
    const movies = this.moviesService.getAll();
    res.send(movies);
  }

  @Post()
  @ApiOperation({
    summary: '영화 추가',
  })
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData);
  }

  @Get(':id') // 동적 라우팅 구성 : 아레에 있는 get요청을 전부 여기로 하는 특징이 있음 (다른 요청도 동일)
  @ApiOperation({
    summary: '영화 하나 가져오기',
  })
  getOne(@Param('id') movieId: number): Movie {
    return this.moviesService.getOne(movieId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '영화 하나 지우기',
  })
  remove(@Param('id') movieId: number) {
    return this.moviesService.deleteOne(movieId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '영화 하나 수정하기',
  })
  patch(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto) {
    return this.moviesService.update(movieId, updateData);
  }
}
