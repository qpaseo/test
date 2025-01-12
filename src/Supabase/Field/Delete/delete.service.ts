import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../db/Supabase';
import { DatabaseType } from '../../types/SupabaseType';

@Injectable()
export class DeleteService {
  private supabase: SupabaseClient<
    DatabaseType,
    'DATABASE_URL' | 'DATABASE_KEY',
    any
  >;

  constructor(private readonly supabaseService: Supabase) {
    this.supabase = this.supabaseService.getClient();
  }

  async deleteField(token: string, id: string) {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('Field-Delete : 해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
        todoInfo: null,
      };
    }

    const email = user?.user?.email;

    const { data: DeleteData, error: DeleteError } = await this.supabase
      .from('fields')
      .delete()
      .eq('email', email)
      .eq('id', id);

    if (DeleteError) {
      console.log(DeleteError.message);
      return {
        type: 'error',
      };
    }
    return {
      type: 'success',
    };
  }
}
