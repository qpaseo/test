//클라와 요청시 사용
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
  email: string;

  @ApiProperty({ example: '제목입니다', description: '게시글 제목' })
  title: string;

  @ApiProperty({ example: '내용입니다', description: '게시글 내용' })
  content: string;
}
