import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../db/Supabase';
import { DatabaseType } from '../../types/SupabaseType';
import { randomUUID } from 'crypto';

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

  async updateField(
    token: string,
    id: string,
    afterGrop: string,
    afterField: string,
    img: Express.Multer.File,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('Field-update : 해당하는 유저가 존재하지 않습니다', token);
      return { type: 'error' };
    }

    const email = user?.user?.email;

    // 해당하는 분야 찾기
    const { data: fieldData, error: fieldError } = await this.supabase
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
      grop: afterGrop,
      field: afterField,
    };

    // 이미지가 업로드된 경우 처리
    if (img) {
      const fileName = `${randomUUID()}-${img.originalname}`;
      const { data: fileData, error: uploadError } = await this.supabase.storage
        .from('field-img')
        .upload(fileName, img.buffer, { contentType: img.mimetype });

      if (uploadError) {
        console.error('File upload error:', uploadError.message);
        return { type: 'error' };
      }

      const { data: publicData } = this.supabase.storage
        .from('field-img')
        .getPublicUrl(fileName);

      if (!publicData?.publicUrl) {
        console.error('Failed to generate public URL');
        return { type: 'error' };
      }

      query.img = publicData.publicUrl;
    }

    // 데이터 업데이트
    const { error: updateError } = await this.supabase
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
