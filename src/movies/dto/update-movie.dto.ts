import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsNumber()
  readonly year?: number;
  
  @IsString({ each: true })
  readonly genres?: string[];
}
