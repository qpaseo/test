import { Body, Headers, Controller, Get } from '@nestjs/common';

import { GetService } from './get.service';

@Controller('todolist')
export class GetController {
  constructor(private readonly getService: GetService) {}

  @Get('/')
  async create(
    @Body()
    data: {
      date: string;
      grop: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { grop, date } = data;
    const token = authorization.substring('Bearer '.length);
    return this.getService.getTodo(token, grop, date);
  }
}
