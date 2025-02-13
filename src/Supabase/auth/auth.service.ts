import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umun_Auth_Database } from '../db/Umun_Auth_Database';
import { DatabaseType } from '../types/SupabaseType';

@Injectable()
export class AuthService {
  private auth_Database: SupabaseClient<DatabaseType, 'public', any>;

  constructor(private readonly umun_Auth_Database: Umun_Auth_Database) {
    this.auth_Database = this.umun_Auth_Database.getClient();
  }

  // 회원가입
  async signUp(email: string, password: string): Promise<any> {
    try {
      const { data: authData, error: authError } =
        await this.auth_Database.auth.signUp({
          email,
          password,
        });

      if (authError || !authData?.user) {
        console.log('auth_Database authError:', authError);
        throw new Error(
          `Authentication failed: ${authError?.message || 'Unknown error'}`,
        );
      }
      return {
        type: 'success',
      };
    } catch (error) {
      console.error(error);
      return {
        type: 'error',
      };
    }
  }

  // 로그인
  async logIn(email: string, password: string): Promise<any> {
    try {
      const { data: authData, error: authError } =
        await this.auth_Database.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData) {
        console.log('auth_Database authError:', authError);
        throw new Error(
          `Authentication failed: ${authError?.message || 'Unknown error'}`,
        );
      }

      const { access_token, refresh_token } = authData.session;

      return {
        type: 'success',
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (error: any) {
      return {
        type: 'error',
        accessToken: null,
        refreshToken: null,
      };
    }
  }
}
