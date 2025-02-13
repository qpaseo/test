import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { DatabaseType } from '../types/SupabaseType';

//우문정 database연결
@Injectable()
export class Umunjeong_Database {
  private supabase: SupabaseClient<DatabaseType, 'public', any>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>(
      'UMUNJEONG_DATABASE_URL',
    );
    const supabaseKey = this.configService.get<string>(
      'UMUNJEONG_DATABASE_KEY',
    );

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or key is missing');
    }

    this.supabase = createClient<DatabaseType>(supabaseUrl, supabaseKey);
  }

  getClient() {
    return this.supabase;
  }
}
