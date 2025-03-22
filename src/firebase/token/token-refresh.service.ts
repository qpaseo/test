import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../../db/firebase';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthRefreshService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      // Firebase를 이용해 리프레시 토큰 검증 및 새 액세스 토큰 발급
      const decodedToken = await admin.auth().verifyIdToken(refreshToken, true);
      const newAccessToken = await admin
        .auth()
        .createCustomToken(decodedToken.uid);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
