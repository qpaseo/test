import { Body, Headers, Controller, Get, Post } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('/issuance')
  async issuanceToken(
    @Body() refreshData: { refreshToken: string },
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshData;
    try {
      const result = await this.tokenService.get_Access_Token(refreshToken);
      return result;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  @Post('/check')
  async checkToken(
    @Headers('Authorization') authorization: string,
  ): Promise<{ type: string }> {
    try {
      const accessToken = authorization.substring('Bearer '.length);
      const result = await this.tokenService.check_Access_Token(accessToken);
      return result;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
}
