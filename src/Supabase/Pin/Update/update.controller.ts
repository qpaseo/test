import { Body, Controller, Patch, Headers } from '@nestjs/common';
import { UpdateService } from './update.service';

@Controller('pin')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Patch('/patch')
  async updateTodo(
    @Body()
    data: {
      id: string;
      afterGrop: string;
      afterField: string;
      afterPin: string;
      afterPinLink: string;
      img: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { id, afterGrop, afterField, afterPin, afterPinLink, img } = data;
    const token = authorization.substring('Bearer '.length);
    return this.updateService.updatePin(
      token,
      id,
      afterGrop,
      afterField,
      afterPin,
      afterPinLink,
      img,
    );
  }
}
