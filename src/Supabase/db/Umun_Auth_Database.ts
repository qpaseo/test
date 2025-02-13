import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { DatabaseType } from '../types/SupabaseType';

//우문-auth database연결
@Injectable()
export class Umun_Auth_Database {
  private supabase: SupabaseClient<DatabaseType, 'public', any>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>(
      'UMUNJEONG_AUTH_DATABASE_URL',
    );
    const supabaseKey = this.configService.get<string>(
      'UMUNJEONG_AUTH_DATABASE_KEY',
    );

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or key is missing');
    }

    this.supabase = createClient<DatabaseType>(supabaseUrl, supabaseKey);
  }

  getClient() {
    return this.supabase;
  }

  async SUPABSE_GET_USER_ID(token: string): Promise<string> {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error) {
      return `Error ${error.message}`;
    }
    return data.user.id;
  }
}
