//유저의 email을 반환도
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../db/firebase';

@Injectable()
export class Get_User_Id extends FirebaseService {
  async getUserIdFromToken(token: string): Promise<string> {
    //db안에 있는
    const userID = await this.getUserEmail(token);
    return userID;
  }
}
