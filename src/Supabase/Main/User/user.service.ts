import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umun_Auth_Database } from '../../db/Umun_Auth_Database';
import { DatabaseType } from '../../types/SupabaseType';

@Injectable()
export class UserService {
  private supabase: SupabaseClient<DatabaseType, 'public', any>;

  constructor(private readonly supabaseService: Umun_Auth_Database) {
    this.supabase = this.supabaseService.getClient();
  }

  async getUserInterests(token: string): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('user-get : 해당하는 유저가 존재하지 않습니다', token);
      console.log(finduserError);
      return {
        type: 'error',
        todoInfo: null,
      };
    }

    const email = user?.user?.email;

    // 데이터 가져오기
    const { data: userData, error: userError } = await this.supabase
      .from('userinfo')
      .select('interest')
      .eq('email', email);

    if (userError) {
      return {
        type: 'error',
        userInfo: null,
      };
    }

    return {
      type: 'success',
      userInfo: userData,
    };
  }
}
