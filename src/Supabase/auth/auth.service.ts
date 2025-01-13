import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../db/Supabase';
import { DatabaseType } from '../types/SupabaseType';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient<
    DatabaseType,
    'DATABASE_URL' | 'DATABASE_KEY',
    any
  >;

  constructor(private readonly supabaseService: Supabase) {
    this.supabase = this.supabaseService.getClient();
  }

  // 회원가입
  async signUp(email: string, password: string): Promise<any> {
    console.log('signin : ', email, password);
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign-up error:', error.message);
        throw new Error(`Sign-up failed: ${error.message}`);
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
    console.log('login : ', email, password);
    try {
      const { data: authData, error: authError } =
        await this.supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData?.session) {
        console.log('Supabase authError:', authError);
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
      console.error(error);
      return {
        type: 'error',
        accessToken: null,
        refreshToken: null,
      };
    }
  }
}
