// Rredis의 기능중 하나인 속도 제한를 하기위한 미들웨어의 함수

import { Injectable } from '@nestjs/common'; // class를 상공받는거(맆수)
import { InjectRedis } from '@nestjs-modules/ioredis'; // InjectRedis : 레디스 가져오는거
import { Redis } from 'ioredis';

@Injectable()
export class RateLimitService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async checkRateLimit(userID: string): Promise<boolean> {
    const key = `rate-llimit:${userID}`;
    const limit = 3; //횟수
    const window = 60; // 사간초

    const current = await this.redis.get(key);

    if (current && parseInt(current) >= limit) {
      return false; //요청 컷
    }

    await this.redis.multi().incr(key).expire(key, window).exec(); // << 요청이 잘 되면 카운트 부여 
    //multi : 뒤에오는 명령어 동시 실행, 
    //incr : key +1, 
    //expire : 키의 조건 갱신(redis에서 처리)
    //exec : 앞의 있는 명령어의 실행 여부를 배열로 반환 [0,1,1,0] (0 : 실패, 1 ; 성공)
 
    return true; // ok~
  }
}
