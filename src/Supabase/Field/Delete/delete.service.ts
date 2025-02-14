import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umunjeong_Database } from '../../db/Umunjeong_Database';
import { Umun_Auth_Database } from '../../db/Umun_Auth_Database';
import { DatabaseType } from '../../types/SupabaseType';

@Injectable()
export class DeleteService {
   private dataDatabase: SupabaseClient<DatabaseType, 'public', any>;
    private authDatabase: SupabaseClient<DatabaseType, 'public', any>;
  
    constructor(
      private readonly DataDatabase: Umunjeong_Database,
      private readonly AuthDatabase: Umun_Auth_Database,
    ) {
      this.dataDatabase = this.DataDatabase.getClient();
      this.authDatabase = this.AuthDatabase.getClient();
    }
  

  async deleteField(token: string, id: string) {
    const { data: user, error: finduserError } =
      await this.authDatabase.auth.getUser(token);

    if (finduserError) {
      console.log('Field-Delete : 해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
        todoInfo: null,
      };
    }

    const email = user?.user?.email;

    const { data: DeleteData, error: DeleteError } = await this.dataDatabase
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
