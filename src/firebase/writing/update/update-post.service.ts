import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../db/firebase';
import { UpdatePostDto } from './dto/update-post.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UpdatePostService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async update(updatePostDto: UpdatePostDto, newImageUrl: string) {
    const { email, title, newTitle, newContent } = updatePostDto;
    // Firebase 인증을 통해 사용자 이메일 추출
    const userEmail = await this.firebaseService.getUserEmail(email);

    // writings 컬렉션에서 title과 email이 모두 일치하는 문서 검색
    const writingsCollection = this.firebaseService
      .getDB()
      .collection('writings');
    const querySnapshot = await writingsCollection
      .where('title', '==', title)
      .where('email', '==', userEmail)
      .get();

    if (querySnapshot.empty) {
      throw new Error('Post not found');
    }

    // 검색된 첫 번째 문서를 사용 (여러 개 존재 시 추가 로직 필요)
    const postDoc = querySnapshot.docs[0];
    const postRef = postDoc.ref;

    // 기존 이미지 삭제 (필요 시)
    const existingPost = postDoc.data();
    if (existingPost?.imageUrl) {
      const filePath = this.extractFilePath(existingPost.imageUrl);
      const bucket = admin.storage().bucket();
      await bucket.file(filePath).delete();
    }

    // 게시글 업데이트
    await postRef.update({
      email: userEmail,
      title: newTitle,
      content: newContent,
      imageUrl: newImageUrl,
      updatedAt: new Date(),
    });

    return { message: 'Post updated successfully' };
  }

  /**
   * Firebase Storage URL에서 파일 경로를 추출하는 메소드
   * 실제 URL 구조에 맞게 구현 필요
   */
  private extractFilePath(imageUrl: string): string {
    const url = new URL(imageUrl);
    return url.pathname.slice(1);
  }
}
