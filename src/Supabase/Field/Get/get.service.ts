import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../db/Supabase';
import { DatabaseType } from '../../types/SupabaseType';

@Injectable()
export class GetService {
  private supabase: SupabaseClient<
    DatabaseType,
    'DATABASE_URL' | 'DATABASE_KEY',
    any
  >;

  constructor(private readonly supabaseService: Supabase) {
    this.supabase = this.supabaseService.getClient();
  }

  private transformToObject(todoData: any[]): any {
    return todoData.reduce((acc, item, index) => {
      acc[index + 1] = {
        id: item.id,
        field: item.field,
        pincount: item.pincount,
        img: item.img,
      };
      return acc;
    }, {});
  }

  async getField(
    token: string,
    grop: string,
    type: number,
    text: string,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.error('Field-Get : 해당하는 유저가 존재하지 않습니다:', token);
      return {
        type: 'error',
        pinInfo: null,
      };
    }

    const email = user?.user?.email;

    const query = this.supabase
      .from('fields')
      .select('*')
      .eq('email', email)
      .eq('grop', grop);

    // type에 따라 조건 추가
    if (type === 2) {
      query.ilike('field', `%${text}%`);
    }

    // 데이터 조회
    const { data: fieldData, error: fieldError } = await query;

    if (fieldError) {
      throw new Error(`데이터를 가져오는 데 실패: ${fieldError.message}`);
    }

    const transformedData = this.transformToObject(fieldData);

    return {
      type: 'success',
      fieldInfo:
        Object.keys(transformedData).length > 0 ? transformedData : null,
    };
  }
}
