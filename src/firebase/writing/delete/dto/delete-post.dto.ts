import { ApiProperty } from '@nestjs/swagger';

export class DeletePostDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '게시글 제목', example: '게시글 제목' })
  title: string;
}
