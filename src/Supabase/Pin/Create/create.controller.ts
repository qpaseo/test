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

import { CreateService } from './create.service';

@Controller('pin')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post('post')
  async create(
    @Body()
    data: {
      grop: string;
      field: string;
      pin: string;
      link: string;
      img: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { grop, field, pin, link, img } = data;
    const token = authorization.substring('Bearer '.length);
    return this.createService.createPin(token, grop, field, pin, link, img);
  }
}
