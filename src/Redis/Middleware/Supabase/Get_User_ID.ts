import { Injectable } from '@nestjs/common';
import { Supabase } from '../../../Supabase/db/Supabase';

@Injectable()
export class Get_User_Id extends Supabase {
  async getUserIdFromToken(token: string): Promise<string> {
    const userID = await this.SUPABSE_GET_USER_ID(token);
    return userID;
  }
}
