import { Injectable } from '@nestjs/common';
import { Umun_Auth_Database } from '../../../Supabase/db/Umun_Auth_Database';

@Injectable()
export class Get_User_Id extends Umun_Auth_Database {
  async getUserIdFromToken(token: string): Promise<string> {
    const userID = await this.SUPABSE_GET_USER_ID(token);
    return userID;
  }
}
