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
    field: string,
    type: number,
    text: string,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
        todoInfo: null,
      };
    }

    const email = user?.user?.email;

    // 데이터 가져오기
    if (type === 2) {
      const { data: fieldData, error: fieldError } = await this.supabase
        .from('fields')
        .select('*')
        .eq('email', email)
        .eq('grop', grop)
        .ilike('field', `%${text}%`);

      if (fieldError) {
        console.error('분야를 가져오는 데 실패:', fieldError.message);
        return {
          type: 'error',
          todoInfo: null,
        };
      }

      const transformedData = this.transformToObject(fieldData);

      if (transformedData.length > 0) {
        return {
          type: 'success',
          todoInfo: transformedData,
        };
      } else {
        return {
          type: 'success',
          todoInfo: null,
        };
      }
    } else {
      const { data: fieldData, error: fieldError } = await this.supabase
        .from('fields')
        .select('*')
        .eq('email', email)
        .eq('grop', grop);

      if (fieldError) {
        console.error('할일을 가져오는 데 실패:', fieldError.message);
        return {
          type: 'error',
          todoInfo: null,
        };
      }

      const transformedData = this.transformToObject(fieldData);

      return {
        type: 'success',
        todoInfo: transformedData,
      };
    }
  }
}
