//보통 환영하는 메세지

import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  heme() {
    return 'Welcome to my Movie API';
  }
}
