import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umunjeong_Database } from '../../../db/Umunjeong_Database';
import { DatabaseType } from '../../../types/SupabaseType';

@Injectable()
export class CreateService {
  private supabase: SupabaseClient<DatabaseType, 'public', any>;
  constructor(private readonly supabaseService: Umunjeong_Database) {
    this.supabase = this.supabaseService.getClient();
  }

  async createTodo(
    token: string,
    group: string,
    name: string,
    state: string,
    todoStartDay: string,
    todoEndDay: string,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('Todo-create : 해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
      };
    }

    const email = user?.user?.email;

    // 중복 확인
    const { data: titleMatch, error: titleError } = await this.supabase
      .from('todos')
      .select('*')
      .eq('group', group)
      .eq('todo', name)
      .eq('todoStartDay', todoStartDay)
      .eq('todoEndDay', todoEndDay);

    if (titleMatch && titleMatch.length > 0) {
      throw new Error('이미 존재하는 할일 입니다.');
    }

    if (email) {
      const { data, error } = await this.supabase.from('todos').insert({
        group: group,
        todo: name,
        state: state,
        todostartday: todoStartDay,
        todoendday: todoEndDay,
        email: email,
      });

      if (error) {
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
