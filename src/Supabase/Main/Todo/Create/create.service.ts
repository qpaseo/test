import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../../db/Supabase';
import { DatabaseType } from '../../../types/SupabaseType';


type Token = string;

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

  async createTodo(
    token: string,
    grop: string,
    todo: string,
    todoStartDay: string,
    todoEndDay: string,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
      };
    }

    const email = user?.user?.email;

    // 중복 확인
    const { data: titleMatch, error: titleError } = await this.supabase
      .from('todos')
      .select('*')
      .eq('grop', grop)
      .eq('todo', todo)
      .eq('todoStartDay', todoStartDay)
      .eq('todoEndDay', todoEndDay);

    if (titleMatch && titleMatch.length > 0) {
      throw new Error('이미 존재하는 할일 입니다.');
    }

    if (email) {
      console.log(email,grop,todo,todoStartDay,todoEndDay)
      const { data, error } = await this.supabase.from('todos').insert({
        grop: grop,
        todo: todo,
        todostartday: todoStartDay,
        todoendday: todoEndDay,
        email: email,
      });

      if (error) {
        console.log(error.message)
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
