import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../../db/Supabase';
import { DatabaseType } from '../../../types/SupabaseType';

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

  async updateTodo(
    token: string,
    id: string,
    afterGrop: string,
    afterTodo: string,
    afterStartDay: string,
    afterEndDay: string,
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

    // 해당하는 todo 찾기
    const { data: toDoData, error: toDoError } = await this.supabase
      .from('todos')
      .select('*')
      .eq('email', email)
      .eq('id', id)
      .single(); // .single()을 사용하여 단일 결과를 반환

    if (toDoError) {
      console.log('할일을 찾을 수 없습니다');
      return {
        type: 'error',
      };
    }

    // 데이터를 업데이트
    const { data: updatedData, error: updateError } = await this.supabase
      .from('todos')
      .update({
        grop: afterGrop,
        todo: afterTodo,
        todostartday: afterStartDay,
        todoendday: afterEndDay,
      })
      .eq('email', email)
      .eq('id', id);

    if (updateError) {
      console.log('할일 수정 중 오류:', updateError.message);
      return {
        type: 'error',
      };
    }

    return {
      type: 'success',
    };
  }
}
