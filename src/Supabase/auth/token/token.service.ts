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
  async get_Access_Token(refreshToken: string): Promise<any> {
    try {
      const { data: refreshData, error: refreshError } =
        await this.supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (refreshError || !refreshData?.session) {
        throw new Error(
          `Refresh token failed: ${refreshError?.message || 'Unknown error'}`,
        );
      }

      const { access_token } = refreshData.session;

      return {
        type: 'success', 
        accessToken: access_token,
      };
    } catch (error: any) {
      console.error('Refresh Token Error:', error.message);
      return {
        type: 'error', // error : 이메일로 이동
        accessToken: null,
      };
    }
  }
}
