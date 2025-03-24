import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '기존 게시글 제목', example: '게시글 제목' })
  title: string;

  @ApiPropertyOptional({
    description: '새로운 게시글 제목',
    example: '새로운 제목',
  })
  newTitle?: string;

  @ApiPropertyOptional({
    description: '새로운 게시글 내용',
    example: '새로운 내용',
  })
  newContent?: string;
}
