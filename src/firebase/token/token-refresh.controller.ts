import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthRefreshService } from './token-refresh.service';

@ApiTags('인증')
@Controller('auth')
export class AuthRefreshController {
  constructor(private readonly authRefreshService: AuthRefreshService) {}

  @Post('refresh')
  @ApiOperation({
    summary: '액세스 토큰 재발급',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다.',
  })
  @ApiResponse({ status: 200, description: '액세스 토큰 재발급 성공' })
  @ApiResponse({ status: 400, description: '리프레시 토큰이 제공되지 않음' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    return await this.authRefreshService.refreshAccessToken(refreshToken);
  }
}
