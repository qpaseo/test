import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../db/Supabase';
import { DatabaseType } from '../../types/SupabaseType';

@Injectable()
export class UpdateService {
  private supabase: SupabaseClient<
    DatabaseType,
    'DATABASE_URL' | 'DATABASE_KEY',
    any
  >;

  constructor(private readonly supabaseService: Supabase) {
    this.supabase = this.supabaseService.getClient();
  }

  async updateField(
    token: string,
    id: string,
    afterGrop: string,
    afterField: string,
    img: string,
  ) {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('Field-update : 해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
      };
    }

    const email = user?.user?.email;

    // 해당하는 분야 찾기
    const { data: fieldData, error: fieldError } = await this.supabase
      .from('fields')
      .select('*')
      .eq('email', email)
      .eq('id', id)
      .single();

    if (fieldError) {
      console.log('할일을 찾을 수 없습니다');
      return {
        type: 'error',
      };
    }

    // 업데이트 데이터 구성
    const query: Record<string, any> = {
      grop: afterGrop,
      field: afterField,
    };

    if (img !== 'none') {
      query.img = img;
    }

    // 데이터 업데이트
    const { data: updatedData, error: updateError } = await this.supabase
      .from('fields')
      .update(query)
      .eq('email', email)
      .eq('id', id);

    if (updateError) {
      console.log('분야 수정 중 오류:', updateError.message);
      return {
        type: 'error',
      };
    }

    return {
      type: 'success',
    };
  }
}
