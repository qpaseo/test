import { Headers, Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async create(@Headers('Authorization') authorization: string): Promise<any> {
    const token = authorization.substring('Bearer '.length);
    return this.userService.getUserInterests(token);
  }
}
