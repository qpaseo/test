import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ConfigService를 사용하여 env 변수 가져오기
import { DatabaseType } from '../types/supabaseType'; // 타입 정의
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class Supabase {
  private supabase: SupabaseClient<
    DatabaseType,
    'DATABASE_URL' | 'DATABASE_KEY',
    any
  >;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('DATABASE_URL');
    const supabaseKey = this.configService.get<string>('DATABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or key is missing');
    }

    // Supabase 클라이언트 생성
    this.supabase = createClient<DatabaseType>(supabaseUrl, supabaseKey);
  }

  getClient() {
    return this.supabase;
  }

  async SUPABSE_GET_USER_ID(token: string) : Promise<string>{
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error) {
      return `Error ${error.message}`;
    }
    return data.user.id;
  }
}
