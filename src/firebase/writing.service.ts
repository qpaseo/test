//로직 확인 필요
//gpt 참고해서 코드 수정

import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../db/firebase';
import { CreatePostDto } from './dto/create-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class WritingService {
  constructor(private readonly firebaseService: FirebaseService) {}

  // 게시글 생성
  async create(createPostDto: CreatePostDto, imageUrl: string) {
    const { email, title, content } = createPostDto;

    // Firebase 인증을 통해 사용자 이메일 추출
    const userEmail = await this.firebaseService.getUserEmail(email);

    // Firestore DB에서 게시글 작성
    const postRef = this.firebaseService.getDB().collection('writings').doc();
    await postRef.set({
      email: userEmail,
      title,
      content,
      imageUrl, // Firebase Storage에서 업로드한 이미지 URL 추가
      createdAt: new Date(),
    });

    return { message: 'Post created successfully', postId: postRef.id };
  }

  // 게시글 업데이트
  async update(updatePostDto: UpdatePostDto, imageUrl: string) {
    const { email, title, content } = updatePostDto;
    // Firebase 인증을 통해 사용자 이메일 추출
    const userEmail = await this.firebaseService.getUserEmail(email);

    // 기존 게시글을 찾아서 업데이트
    const postRef = this.firebaseService
      .getDB()
      .collection('writings')
      .doc(title);
    const post = await postRef.get();

    if (!post.exists) {
      throw new Error('Post not found');
    }

    // 기존 게시글 내용 업데이트
    await postRef.update({
      email: userEmail,
      content,
      imageUrl, // Firebase Storage에서 업로드한 이미지 URL 추가
      updatedAt: new Date(),
    });

    return { message: 'Post updated successfully' };
  }

  // 게시글 삭제
  async delete(deletePostDto: DeletePostDto) {
    const { email, title } = deletePostDto;

    // Firebase 인증을 통해 사용자 이메일 추출
    const userEmail = await this.firebaseService.getUserEmail(email);

    // Firestore DB에서 게시글 삭제
    const postSnapshot = await this.firebaseService
      .getDB()
      .collection('writings')
      .where('email', '==', userEmail)
      .where('title', '==', title)
      .get();

    if (postSnapshot.empty) {
      throw new Error('Post not found');
    }

    await postSnapshot.docs[0].ref.delete();

    return { message: 'Post deleted successfully' };
  }
}
