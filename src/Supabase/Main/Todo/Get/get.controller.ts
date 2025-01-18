import { Body, Headers, Controller, Get, Post, Query } from '@nestjs/common';

import { GetService } from './get.service';

@Controller('todolist')
export class GetController {
  constructor(private readonly getService: GetService) {}

  @Get('/')
  async create(
    @Query() query: { date: string; group: string },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { group, date } = query;
    const token = authorization.substring('Bearer '.length);
    return this.getService.getTodo(token, group, date);
  }
}
