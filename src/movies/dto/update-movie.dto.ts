import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsString()
  @ApiProperty({ example: 'test' })
  readonly title: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 6000, required: false })
  readonly year?: number;

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    example: ['test3', 'test4'],
    description: '영화 장르 수정',
    required: false,
  })
  readonly genres?: string[];
}
