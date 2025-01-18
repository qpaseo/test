import { Query, Headers, Controller, Get } from '@nestjs/common';

import { GetService } from './get.service';

@Controller('field')
export class GetController {
  constructor(private readonly getService: GetService) {}

  @Get('/')
  async create(
    @Query() query: { group: string; type: number; text: string },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { group, type, text } = query;
    const token = authorization.substring('Bearer '.length);
    return this.getService.getField(token, group, type, text);
  }
}
