import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umunjeong_Database } from '../../db/Umunjeong_Database';
import { Umun_Auth_Database } from '../../db/Umun_Auth_Database';
import { DatabaseType } from '../../types/SupabaseType';
import { randomUUID } from 'crypto';

@Injectable()
export class UpdateService {
   private dataDatabase: SupabaseClient<DatabaseType, 'public', any>;
    private authDatabase: SupabaseClient<DatabaseType, 'public', any>;
  
    constructor(
      private readonly DataDatabase: Umunjeong_Database,
      private readonly AuthDatabase: Umun_Auth_Database,
    ) {
      this.dataDatabase = this.DataDatabase.getClient();
      this.authDatabase = this.AuthDatabase.getClient();
    }
  

  async updateField(
    token: string,
    id: string,
    afterGroup: string,
    afterField: string,
    img: Express.Multer.File,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.authDatabase.auth.getUser(token);

    if (finduserError) {
      console.log('Field-update : 해당하는 유저가 존재하지 않습니다', token);
      return { type: 'error' };
    }

    const email = user?.user?.email;

    // 해당하는 분야 찾기
    const { data: fieldData, error: fieldError } = await this.dataDatabase
      .from('fields')
      .select('*')
      .eq('email', email)
      .eq('id', id)
      .single();

    if (fieldError) {
      console.log('Field-update : 해당 분야를 찾을 수 없습니다');
      return { type: 'error' };
    }

    const query: Record<string, any> = {
      group: afterGroup,
      field: afterField,
    };

    // 이미지가 업로드된 경우 처리
    if (img) {
      const fileName = `${randomUUID()}-${img.originalname}`;
      const { data: fileData, error: uploadError } = await this.dataDatabase.storage
        .from('field-img')
        .upload(fileName, img.buffer, { contentType: img.mimetype });

      if (uploadError) {
        console.error('File upload error:', uploadError.message);
        return { type: 'error' };
      }

      const { data: publicData } = this.dataDatabase.storage
        .from('field-img')
        .getPublicUrl(fileName);

      if (!publicData?.publicUrl) {
        console.error('Failed to generate public URL');
        return { type: 'error' };
      }

      query.img = publicData.publicUrl;
    }

    // 데이터 업데이트
    const { error: updateError } = await this.dataDatabase
      .from('fields')
      .update(query)
      .eq('email', email)
      .eq('id', id);

    if (updateError) {
      console.log('Field-update : 업데이트 중 오류 발생:', updateError.message);
      return { type: 'error' };
    }

    return { type: 'success' };
  }
}
