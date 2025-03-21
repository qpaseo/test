import { Injectable } from '@nestjs/common';
import { initializeApp, cert, getApp, App } from 'firebase-admin/app'; // getApp 추가
import { Auth, getAuth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage'; // Storage 추가
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  public readonly db: Firestore;
  public readonly auth: Auth;
  public readonly storage: Storage; // Firebase Storage 추가

  constructor(private readonly configService: ConfigService) {
    // Firebase 앱이 이미 초기화된 경우 기존 앱을 사용하도록 처리
    let app: App;
    try {
      app = getApp(); // 이미 초기화된 앱을 가져옵니다
    } catch (error) {
      // 앱이 초기화되지 않았다면 새로 초기화합니다
      app = initializeApp({
        credential: cert({
          projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.configService
            .get<string>('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n'),
        }),
        storageBucket: this.configService.get<string>(
          'FIREBASE_STORAGE_BUCKET',
        ),
      });
    }

    this.auth = getAuth(app);
    this.db = getFirestore(app);
    this.storage = getStorage(app); // Firebase Storage 초기화
  }

  // Firebase Storage에서 파일 업로드
  async uploadFile(file: any): Promise<string> {
    const bucket = this.storage.bucket();
    const fileName = `${Date.now()}-${file.originalname}`; // 파일명 설정

    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype, // 파일의 MIME 타입
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => reject(error));
      stream.on('finish', () => {
        fileUpload.makePublic().then(() => {
          resolve(
            `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`,
          ); // 파일 URL 반환
        });
      });
      stream.end(file.buffer); // 파일 데이터를 스트림에 씁니다.
    });
  }

  // 나머지 Firebase 서비스들
  async getUserEmail(token: string): Promise<string> {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return decodedToken.email || 'No email found';
    } catch (error) {
      throw new Error(`Error verifying token: ${error.message}`);
    }
  }

  getDB(): Firestore {
    return this.db;
  }

  getAuth(): Auth {
    return this.auth;
  }
}
