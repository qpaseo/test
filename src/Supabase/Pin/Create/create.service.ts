import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../db/Supabase';
import { DatabaseType } from '../../types/SupabaseType';
@Injectable()
export class CreateService {
  private supabase: SupabaseClient<
    DatabaseType,
    'DATABASE_URL' | 'DATABASE_KEY',
    any
  >;

  constructor(private readonly supabaseService: Supabase) {
    this.supabase = this.supabaseService.getClient();
  }

  async createPin(
    token: string,
    grop: string,
    field: string,
    pin: string,
    link: string,
    img: string,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('Pin-create : 해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
      };
    }

    const email = user?.user?.email;

    // 중복 확인
    const { data: titleMatch, error: titleError } = await this.supabase
      .from('pins')
      .select('*')
      .eq('grop', grop)
      .eq('field', field)
      .eq('pin', pin);

    if (titleMatch && titleMatch.length > 0) {
      return {
        type: 'error',
      };
    }

    if (email) {
      //console.log(email, grop, field);
      const { data, error } = await this.supabase.from('pins').insert({
        grop: grop,
        field: field,
        pin: pin,
        link: link,
        img: img,
        email: email,
      });

      if (error) {
        console.log(error.message);
        return {
          type: 'error',
        };
      }

      return {
        type: 'success',
      };
    }
  }
}
