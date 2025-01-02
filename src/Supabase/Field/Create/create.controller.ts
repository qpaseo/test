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
import { CreateService } from './create.service';

@Controller('field')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post('post')
  async create(
    @Body()
    data: {
      grop: string;
      field: string;
      img: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { grop, field, img } = data;
    const token = authorization.substring('Bearer '.length);
    return this.createService.createField(token, grop, field, img);
  }
}
