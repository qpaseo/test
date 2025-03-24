import { Inject, Injectable } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitService } from './function/RateLimitService';
import { GetUserEmail } from './firebase/getUserEmail';
import { RedisClientType } from 'redis';

@Injectable()
export class RateLimitMiddleware {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly getUserEmail: GetUserEmail, // GetUserEmail 주입
  ) {}

  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res
        .code(401)
        .send({ message: '토큰이 없습니다, 경로 설정을 확인하여 주세요' });
    }

    try {
      // GetUserEmail 인스턴스를 DI로 주입받아서 사용
      const userEmail = await this.getUserEmail.getUserIdFromToken(token);

      const rateLimitService = new RateLimitService(this.redisClient); // Redis를 RateLimitService에 전달

      const isAllowed = await rateLimitService.checkRateLimit(userEmail);

      if (!isAllowed) {
        return res.code(429).send({ message: '과도한 요청이 발생하였습니다' });
      }

      // 요청을 허용하고 다음 처리로 이동
      next();
    } catch (error) {
      return res
        .code(401)
        .send({ message: '서버와의 요청 과정에서 오류 발생!' });
    }
  }
}
