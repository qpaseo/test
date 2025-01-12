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

  async updatePin(
    token: string,
    id: string,
    afterGrop: string,
    afterField: string,
    afterPin: string,
    afterLink: string,
    img: string,
  ) {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
      };
    }

    const email = user?.user?.email;

    // 해당하는 핀 찾기
    const { data: PinData, error: PinError } = await this.supabase
      .from('pins')
      .select('*')
      .eq('email', email)
      .eq('id', id)
      .single();

    if (PinError) {
      console.log('할일을 찾을 수 없습니다');
      return {
        type: 'error',
      };
    }

    // 업데이트 데이터 구성
    const query: Record<string, any> = {
      // <키 타입, 값 타입>
      grop: afterGrop,
      field: afterField,
      pin: afterPin,
      link: afterLink,
    };

    if (img !== 'none') {
      query.img = img;
    }

    // 데이터 업데이트
    const { data: updatedData, error: updateError } = await this.supabase
      .from('pins')
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
