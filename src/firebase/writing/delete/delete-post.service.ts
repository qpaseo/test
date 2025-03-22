import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../db/firebase';
import { DeletePostDto } from './dto/delete-post.dto';

@Injectable()
export class DeletePostService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async delete(deletePostDto: DeletePostDto) {
    const { email, title } = deletePostDto;

    // Firebase 인증을 통해 사용자 이메일 추출
    const userEmail = await this.firebaseService.getUserEmail(email);

    // writings 컬렉션에서 email과 title이 일치하는 문서 검색
    const postSnapshot = await this.firebaseService
      .getDB()
      .collection('writings')
      .where('email', '==', userEmail)
      .where('title', '==', title)
      .get();

    if (postSnapshot.empty) {
      throw new Error('Post not found');
    }

    // 검색된 첫 번째 문서 삭제
    await postSnapshot.docs[0].ref.delete();

    return { message: 'Post deleted successfully' };
  }
}
