import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../db/Supabase';
import { DatabaseType } from '../../types/SupabaseType';

@Injectable()
export class TokenService {
  private supabase: SupabaseClient<
    DatabaseType,
    'DATABASE_URL' | 'DATABASE_KEY',
    any
  >;

  constructor(private readonly supabaseService: Supabase) {
    this.supabase = this.supabaseService.getClient();
  }

  //리프레쉬로 엑세스 발급
  async get_Access_Token(
    accessToken: string,
    refreshToken: string,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(accessToken);

    //유저가 없으면 => (엑세스 유효기간 지남)
    if (finduserError) {
      const { data: refreshData, error: refreshError } =
        await this.supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (refreshError || !refreshData?.session) {
        return {
          type: 'error',
        };
      }

      //잘 가면 리프레쉬 발금
      const { access_token } = refreshData.session;

      return {
        type: 'success',
        accessToken: access_token,
      };
    }
  }
}
