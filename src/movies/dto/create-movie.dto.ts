//dto : 클라가 서버한테 보내는거
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsString({ each: true }) // 배열 설정
  @IsOptional() //값이 있기만 하면 됨
  readonly genres?: string[];
}
