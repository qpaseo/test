import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../../db/Supabase';
import { DatabaseType } from '../../../types/SupabaseType';
import { parse, isValid, format } from 'date-fns';

@Injectable()
export class GetService {
  private supabase: SupabaseClient<
    DatabaseType,
    'DATABASE_URL' | 'DATABASE_KEY',
    any
  >;

  constructor(private readonly supabaseService: Supabase) {
    this.supabase = this.supabaseService.getClient();
  }

  // 날짜 형식이 잘못되었을 경우, 올바른 형식으로 변환하는 함수
  private formatDate(date: string): string {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate)) {
      throw new Error('잘못된 날짜 형식입니다');
    }
    return format(parsedDate, 'yyyy-MM-dd');
  }

  // todoInfo 배열을 객체로 변환하는 함수
  private transformToObject(todoData: any[]): any {
    return todoData.reduce((acc, item, index) => {
      acc[index + 1] = {
        id: item.id, 
        name: item.todo,
        state : item.state,
        start: item.todostartday,
        end: item.todoendday,
      };
      return acc;
    }, {});
  }

  async getTodo(token: string, grop: string, date: string): Promise<any> {
    // 날짜 형식 수정
    let formattedDate: string;
    try {
      formattedDate = this.formatDate(date);
    } catch (error) {
      console.error('날짜 형식 오류:', error.message);
      return {
        type: 'error',
        todoInfo: null,
      };
    }

    const { data: user, error: finduserError } = await this.supabase.auth.getUser(token);

    if (finduserError) {
      console.log('해당하는 유저가 존재하지 않습니다', token);
      return {
        type: 'error',
        todoInfo: null,
      };
    }

    const email = user?.user?.email;

    // 데이터 가져오기
    const { data: toDoData, error: toDoError } = await this.supabase
      .from('todos')
      .select('*')
      .eq('email', email)
      .eq('grop', grop)
      .lte('todostartday', formattedDate) // 시작일이 주어진 날짜보다 작거나 같으면
      .gte('todoendday', formattedDate); // 종료일이 주어진 날짜보다 크거나 같으면

    if (toDoError) {
      console.error('할일을 가져오는 데 실패:', toDoError.message);
      return {
        type: 'error',
        todoInfo: null,
      };
    }

    // 변환된 데이터 반환
    const transformedData = this.transformToObject(toDoData);

    return {
      type: 'success',
      todoInfo: transformedData,
    };
  }
}
