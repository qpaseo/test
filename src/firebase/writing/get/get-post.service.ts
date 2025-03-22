import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../db/firebase';

@Injectable()
export class GetPostsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findPostsByEmail(email: string) {
    // Firebase 인증을 통해 사용자 이메일 추출
    const userEmail = await this.firebaseService.getUserEmail(email);

    // writings 컬렉션에서 이메일이 일치하는 모든 문서 검색
    const postsCollection = this.firebaseService.getDB().collection('writings');
    const querySnapshot = await postsCollection
      .where('email', '==', userEmail)
      .get();

    // 결과 문서 배열 반환
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return posts;
  }
}
