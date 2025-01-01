// 사용자의 토큰을 받아와 유저의 id를 반환하는 함수,  Rredis연결(속도제한은  id기준으로 해봅시다~)

import { Injectable } from '@nestjs/common';
import { Supabase } from 'src/Supabase/db/Supabase';

@Injectable()
export class Get_User_Id extends Supabase {
  async getUserIdFromToken(token: string) : Promise<string> {
    const userID = await this.SUPABSE_GET_USER_ID(token);
    return userID
  }
}
