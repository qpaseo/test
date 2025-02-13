import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umunjeong_Database } from '../../db/Umunjeong_Database';
import { DatabaseType } from '../../types/SupabaseType';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateService {
  private supabase: SupabaseClient<DatabaseType, 'public', any>;

  constructor(private readonly supabaseService: Umunjeong_Database) {
    this.supabase = this.supabaseService.getClient();
  }

  async createPin(
    token: string,
    group: string,
    field: string,
    pin: string,
    link: string,
    img: Express.Multer.File,
  ): Promise<any> {
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError || !user?.user?.email) {
      console.error('Pin-create: Invalid user or token', token);
      return { type: 'error', message: 'Invalid user or token' };
    }

    const email = user.user.email;

    // 중복 확인
    const { data: titleMatch, error: titleError } = await this.supabase
      .from('pins')
      .select('*')
      .eq('group', group)
      .eq('field', field)
      .eq('pin', pin);

    if (titleError) {
      console.error('Pin-create: Error checking duplicate', titleError.message);
      return { type: 'error' };
    }

    if (titleMatch && titleMatch.length > 0) {
      return { type: 'error' };
    }

    const fileName = `${randomUUID()}-${img.originalname}`;
    const { error: uploadError } = await this.supabase.storage
      .from('pin-img')
      .upload(fileName, img.buffer, {
        contentType: img.mimetype,
      });

    if (uploadError) {
      console.error('Pin-create: File upload error', uploadError.message);
      return { type: 'error' };
    }

    // 파일 URL 가져오기
    const { data: publicUrlData } = this.supabase.storage
      .from('pin-img')
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      console.error('Pin-create: Failed to generate public URL');
      return { type: 'error' };
    }

    const fileUrl = publicUrlData.publicUrl;

    const { error: insertError } = await this.supabase.from('pins').insert({
      group,
      field,
      pin,
      link,
      img: fileUrl,
      email,
    });

    if (insertError) {
      console.error('Pin-create: Database insert error', insertError.message);
      return { type: 'error' };
    }

    return { type: 'success' };
  }
}
