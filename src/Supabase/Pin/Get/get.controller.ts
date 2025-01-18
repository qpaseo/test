import { Query, Headers, Controller, Get } from '@nestjs/common';

import { GetService } from './get.service';

@Controller('pin')
export class GetController {
  constructor(private readonly getService: GetService) {}

  @Get('/')
  async create(
    @Query()
    query: {
      group: string;
      field: string;
      type: number;
      text: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { group, field, type, text } = query;
    const token = authorization.substring('Bearer '.length);
    return this.getService.getPin(token, group, field, type, text);
  }
}
