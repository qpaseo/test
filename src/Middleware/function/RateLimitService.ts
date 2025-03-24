// Rredis의 기능중 하나인 속도 제한를 하기위한 미들웨어의 함수
//multi : 뒤에오는 명령어 동시 실행,
//incr : key +1,
//expire : 키의 조건 갱신(redis에서 처리)
//exec : 앞의 있는 명령어의 실행 여부를 배열로 반환 [0,1,1,0] (0 : 실패, 1 ; 성공)

import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';


@Injectable()
export class RateLimitService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async checkRateLimit(email: string): Promise<boolean> {
    const key = `rate-limit:${email}`;
    const penaltyKey = `penalty:${email}`;
    const limit = 50;
    const window = 10;
    const penaltyWindow = 100000000;

    const penalty = await this.redisClient.get(penaltyKey);
    if (penalty) {
      return false;
    }

    const current = await this.redisClient.get(key);
    if (current && parseInt(current) >= limit) {
      // 페널티 키 설정
      await this.redisClient.set(penaltyKey, '1', {
        EX: penaltyWindow, // EX 옵션은 만료 시간(초)을 설정
      });

      return false;
    }

    // 요청 횟수 증가 및 만료 시간 설정
    await this.redisClient.multi().incr(key).expire(key, window).exec();

    return true; // 요청 허용
  }
}
