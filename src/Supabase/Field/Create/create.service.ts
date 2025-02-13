import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Umunjeong_Database } from '../../db/Umunjeong_Database';
import { DatabaseType } from '../../types/SupabaseType';
import { randomUUID } from 'crypto'; // UUID 생성용

@Injectable()
export class CreateService {
  private supabase: SupabaseClient<DatabaseType, 'public', any>;
  constructor(private readonly supabaseService: Umunjeong_Database) {
    this.supabase = this.supabaseService.getClient();
  }

  // 파일명에 특수 문자를 제거하는 함수
  private sanitizeFileName(fileName: string): string {
    // 파일명에서 특수 문자 및 공백 제거
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_'); // 영어, 숫자, 점, 대시만 허용
  }

  async createField(
    token: string,
    group: string,
    field: string,
    img: Express.Multer.File,
  ): Promise<any> {
    // 유저 인증 확인
    const { data: user, error: finduserError } =
      await this.supabase.auth.getUser(token);

    if (finduserError || !user?.user?.email) {
      console.log('Field-create: 해당하는 유저가 존재하지 않습니다', token);
      return { type: 'error', message: 'Invalid user or token' };
    }

    const email = user.user.email;

    // 중복 확인
    const { data: titleMatch, error: titleError } = await this.supabase
      .from('fields')
      .select('*')
      .eq('group', group)
      .eq('field', field);

    if (titleMatch && titleMatch.length > 0) {
      throw new Error('이미 존재하는 필드입니다.');
    }

    let imgUrl = '';

    // 이미지 파일 업로드 처리
    if (img) {
      const sanitizedFileName = `${randomUUID()}-${this.sanitizeFileName(img.originalname)}`; // 특수 문자 제거한 파일명 생성
      const { error: uploadError } = await this.supabase.storage
        .from('field-img') // 스토리지 버킷 이름
        .upload(sanitizedFileName, img.buffer, {
          contentType: img.mimetype,
        });

      if (uploadError) {
        console.error('이미지 업로드 오류:', uploadError.message);
        return { type: 'error', message: 'Image upload failed' };
      }

      // 업로드된 파일 URL 생성
      const { data: publicUrlData } = this.supabase.storage
        .from('field-img')
        .getPublicUrl(sanitizedFileName);

      if (!publicUrlData?.publicUrl) {
        console.error('공개 URL 생성 실패');
        return { type: 'error', message: 'Failed to generate file URL' };
      }

      imgUrl = publicUrlData.publicUrl; // 이미지 URL 저장
    }

    // 필드 데이터 삽입
    const { error } = await this.supabase.from('fields').insert({
      group,
      field,
      img: imgUrl, // 이미지 URL 저장
      email,
    });

    if (error) {
      console.error('필드 생성 오류:', error.message);
      return { type: 'error', message: 'Field creation failed' };
    }

    return { type: 'success' };
  }
}
