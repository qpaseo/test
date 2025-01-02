import { Body, Controller, Patch, Headers } from '@nestjs/common';
import { UpdateService } from './update.service';

@Controller('field')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Patch('/patch')
  async updateTodo(
    @Body()
    data: {
      id: string;
      afterGrop: string;
      afterField: string;
      img: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { id, afterGrop, afterField, img } = data;
    const token = authorization.substring('Bearer '.length);
    return this.updateService.updateField(
      token,
      id,
      afterGrop,
      afterField,
      img,
    );
  }
}
