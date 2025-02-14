import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umunjeong_Database } from '../../db/Umunjeong_Database';
import { Umun_Auth_Database } from '../../db/Umun_Auth_Database';
import { DatabaseType } from '../../types/SupabaseType';

@Injectable()
export class GetService {
  private dataDatabase: SupabaseClient<DatabaseType, 'public', any>;
  private authDatabase: SupabaseClient<DatabaseType, 'public', any>;

  constructor(
    private readonly DataDatabase: Umunjeong_Database,
    private readonly AuthDatabase: Umun_Auth_Database,
  ) {
    this.dataDatabase = this.DataDatabase.getClient();
    this.authDatabase = this.AuthDatabase.getClient();
  }

  private transformToObject(todoData: any[]): any {
    return todoData.reduce((acc, item, index) => {
      acc[index + 1] = {
        id: item.id,
        pin: item.field,
        link: item.link,
        img: item.img,
      };
      return acc;
    }, {});
  }

  async getPin(
    token: string,
    group: string,
    field: string,
    type: number,
    text: string,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.authDatabase.auth.getUser(token);

    if (finduserError) {
      console.error('Pin-get : 해당하는 유저가 존재하지 않습니다:', token);
      return {
        type: 'error',
        fieldInfo: null,
      };
    }

    const email = user?.user?.email;

    const query = this.dataDatabase
      .from('pins')
      .select('*')
      .eq('email', email)
      .eq('group', group)
      .eq('field', field);

    // type에 따라 조건 추가
    if (type == 2) {
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
      pinInfo: Object.keys(transformedData).length > 0 ? transformedData : null,
    };
  }
}
