import { Controller, Post, Body } from '@nestjs/common';
import { AuthRefreshService } from './token-refresh.service';

@Controller('auth')
export class AuthRefreshController {
  constructor(private readonly authRefreshService: AuthRefreshService) {}

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    return await this.authRefreshService.refreshAccessToken(refreshToken);
  }
}
