//dto : 클라가 서버한테 보내는거
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @IsString()
  @ApiProperty({ example: 'test title' })
  readonly title: string;

  @IsNumber()
  @ApiProperty({ example: 1000 })
  readonly year: number;

  @IsString({ each: true }) // 배열 설정
  @IsOptional() //값이 있기만 하면 됨
  @ApiProperty({
    example: ['test1', 'test2'],
    description: '영화의 장르',
    required: false,
  })
  readonly genres?: string[];
}
