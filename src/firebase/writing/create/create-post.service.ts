import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../db/firebase';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entity/post.entity';

@Injectable()
export class CreatePostService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createPostDto: CreatePostDto, imageUrl: string) {
    const { email, title, content } = createPostDto;

    // Firebase 인증을 통해 사용자 이메일 추출
    const userEmail = await this.firebaseService.getUserEmail(email);

    // 엔티티를 통한 데이터 구조 명시
    const post = new PostEntity();
    post.email = userEmail;
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.createdAt = new Date();

    // Firestore DB에서 게시글 작성
    const postRef = this.firebaseService.getDB().collection('writings').doc();
    await postRef.set(post);

    return { message: 'Post created successfully', postId: postRef.id };
  }
}
