import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../db/Supabase';
import { DatabaseType } from '../../types/SupabaseType';
import { randomUUID } from 'crypto'; // UUID 생성용

@Injectable()
export class UpdateService {
  private supabase: SupabaseClient<DatabaseType, 'public', any>;

  constructor(private readonly supabaseService: Supabase) {
    this.supabase = this.supabaseService.getClient();
  }

  async updatePin(
    token: string,
    id: string,
    afterGroup: string,
    afterField: string,
    afterPin: string,
    afterLink: string,
    img: Express.Multer.File,
  ) {
    // 유저 인증 확인
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError || !user?.user?.email) {
      console.log('유효하지 않은 유저 또는 토큰', token);
      return { type: 'error', message: 'Invalid user or token' };
    }

    const email = user.user.email;

    // 기존 핀 데이터 확인
    const { data: PinData, error: PinError } = await this.supabase
      .from('pins')
      .select('*')
      .eq('email', email)
      .eq('id', id)
      .single();

    if (PinError) {
      console.log('핀을 찾을 수 없습니다');
      return { type: 'error', message: 'Pin not found' };
    }

    const query: Record<string, any> = {
      group: afterGroup,
      field: afterField,
      pin: afterPin,
      link: afterLink,
    };

    // 이미지 파일이 있을 경우 처리
    if (img) {
      const fileName = `${randomUUID()}-${img.originalname}`;
      const { error: uploadError } = await this.supabase.storage
        .from('pin-img') // 스토리지 버킷 이름
        .upload(fileName, img.buffer, {
          contentType: img.mimetype,
        });

      if (uploadError) {
        console.error('이미지 업로드 오류:', uploadError.message);
        return { type: 'error', message: 'Image upload failed' };
      }

      // 업로드된 파일 URL 생성
      const { data: publicUrlData } = this.supabase.storage
        .from('pin-img')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        console.error('공개 URL 생성 실패');
        return { type: 'error', message: 'Failed to generate file URL' };
      }

      query.img = publicUrlData.publicUrl; // 새 이미지 URL 추가
    }

    // 데이터 업데이트
    const { error: updateError } = await this.supabase
      .from('pins')
      .update(query)
      .eq('email', email)
      .eq('id', id);

    if (updateError) {
      console.error('핀 업데이트 중 오류:', updateError.message);
      return { type: 'error', message: 'Pin update failed' };
    }

    return { type: 'success', message: 'Pin updated successfully' };
  }
}
