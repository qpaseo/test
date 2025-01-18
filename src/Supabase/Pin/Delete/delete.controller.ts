import { Body, Headers, Controller, Delete } from '@nestjs/common';

import { DeleteService } from './delete.service';

@Controller('pin')
export class DeleteController {
  constructor(private readonly deleteService: DeleteService) {}

  @Delete('/delete')
  async create(
    @Body()
    data: {
      id: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { id } = data;
    const token = authorization.substring('Bearer '.length);
    return this.deleteService.deletePin(token, id);
  }
}
