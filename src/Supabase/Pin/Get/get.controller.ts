import { Query, Headers, Controller, Get } from '@nestjs/common';

import { GetService } from './get.service';

@Controller('pin')
export class GetController {
  constructor(private readonly getService: GetService) {}

  @Get('/')
  async create(
    @Query()
    query: {
      grop: string;
      field: string;
      type: number;
      text: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { grop, field, type, text } = query;
    const token = authorization.substring('Bearer '.length);
    return this.getService.getPin(token, grop, field, type, text);
  }
}
