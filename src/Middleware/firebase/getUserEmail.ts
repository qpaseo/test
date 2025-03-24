//유저의 email을 반환도
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../db/firebase';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetUserEmail extends FirebaseService {
  constructor(public readonly configService: ConfigService) {
    super(configService);
  }

  async getUserIdFromToken(token: string): Promise<string> {
    // DB 안에 있는
    const userEmail = await this.getUserEmail(token);
    return userEmail;
  }
}
