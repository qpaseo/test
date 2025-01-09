import { Body, Headers, Controller, Get, Post } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('/')
  async refreshToken(
    @Body() refreshData: { refreshToken: string },
    @Headers('Authorization') authorization: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshData;
    try {
      const accessToken = authorization.substring('Bearer '.length);
      const result = await this.tokenService.get_Access_Token(
        accessToken,
        refreshToken,
      );
      return result;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
}
