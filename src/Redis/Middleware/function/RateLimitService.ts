// Rredis의 기능중 하나인 속도 제한를 하기위한 미들웨어의 함수
//multi : 뒤에오는 명령어 동시 실행,
//incr : key +1,
//expire : 키의 조건 갱신(redis에서 처리)
//exec : 앞의 있는 명령어의 실행 여부를 배열로 반환 [0,1,1,0] (0 : 실패, 1 ; 성공)

import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RateLimitService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async checkRateLimit(userID: string): Promise<boolean> {
    const key = `rate-limit:${userID}`;
    const penaltyKey = `penalty:${userID}`; // 페널티 상태를 기록할 키
    const limit = 10; // 요청 제한 횟수
    const window = 20; // 요청 제한 기준 시간 (초)
    const penaltyWindow = 10; // 페널티 부여 시간 (초)

    // 페널티 상태 확인
    const penalty = await this.redis.get(penaltyKey);
    if (penalty) {
      return false; // 페널티 상태에서는 요청 불가
    }

    // 현재 요청 횟수 확인
    const current = await this.redis.get(key);
    if (current && parseInt(current) >= limit) {
      // 페널티 키 설정
      await this.redis.set(penaltyKey, '1', 'EX', penaltyWindow);
      return false; // 요청 제한 초과
    }

    // 요청 횟수 증가 및 만료 시간 설정
    await this.redis.multi().incr(key).expire(key, window).exec();

    return true; // 요청 허용
  }
}
