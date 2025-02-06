import { Injectable, NestMiddleware } from '@nestjs/common';
import { RateLimitService } from './function/RateLimitService';
import { Get_User_Id } from './Supabase/Get_User_ID'; // Supabase id를가져오는 함수

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(
    private readonly rateLimitService: RateLimitService,
    private readonly get_User_Id: Get_User_Id,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ message: '토큰이 없습니다, 경로 설정을 확인하여 주세요' });
    }

    try {
      const userId = await this.get_User_Id.getUserIdFromToken(token);

      const isAllowed = await this.rateLimitService.checkRateLimit(userId);

      if (!isAllowed) {
        return res
          .status(429)
          .json({ message: '과도한 요청이 발생하였습니다' });
      }
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: '서버와의 요청 과정에서 오류 발생!' });
    }
  }
}
