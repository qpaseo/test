import { Body, Headers, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ResponseStatus } from '../types/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body()
    signUpData: {
      email: string;
      password: string;
    },
  ): Promise<ResponseStatus> {
    const { email, password } = signUpData;

    try {
      const result = await this.authService.signUp(email, password);
      return result;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // 로그인
  @Post('/signin')
  async logIn(
    @Body() loginData: { email: string; password: string },
  ): Promise<{ accessToken: string; refreshToken: string; name: string }> {
    const { email, password } = loginData;

    try {
      const result = await this.authService.logIn(email, password);
      return result;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}
