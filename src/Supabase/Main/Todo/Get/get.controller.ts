import {
  Body,
  Headers,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
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
