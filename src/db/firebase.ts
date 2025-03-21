import { Injectable } from '@nestjs/common';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  public readonly db: Firestore;
  public readonly auth: Auth;

  constructor(private readonly configService: ConfigService) {
    //서버에서 사용하는 설정(어드민)
    const serviceAccount: ServiceAccount = {
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      privateKey: this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'),
    };

    // Firebase Admin 초기화
    const app = initializeApp({
      credential: cert(serviceAccount),
    });
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }

  //유저 이메일 반환
  async getUserEmail(token: string): Promise<string> {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return decodedToken.email || 'No email found';
    } catch (error) {
      throw new Error(`Error verifying token: ${error.message}`);
    }
  }

  //db반환 (데이터 조정시 사용)
  getDB(): Firestore {
    return this.db;
  }

  //auth반환 (로그인 회원가입시 사용)
  getAuth(): Auth {
    return this.auth;
  }
}
