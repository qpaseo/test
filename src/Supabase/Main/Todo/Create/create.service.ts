import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umunjeong_Database } from '../../../db/Umunjeong_Database';
import { Umun_Auth_Database } from '@supabase/db/Umun_Auth_Database';
import { DatabaseType } from '../../../types/SupabaseType';

@Injectable()
export class CreateService {
  private dataDatabase: SupabaseClient<DatabaseType, 'public', any>;
   private authDatabase: SupabaseClient<DatabaseType, 'public', any>;
 
   constructor(
     private readonly DataDatabase: Umunjeong_Database,
     private readonly AuthDatabase: Umun_Auth_Database,
   ) {
     this.dataDatabase = this.DataDatabase.getClient();
     this.authDatabase = this.AuthDatabase.getClient();
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
      await this.authDatabase.auth.getUser(token);

    if (finduserError) {
      console.log('Todo-create : 해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
      };
    }

    const email = user?.user?.email;

    // 중복 확인
    const { data: titleMatch, error: titleError } = await this.dataDatabase
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
      const { data, error } = await this.dataDatabase.from('todos').insert({
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
