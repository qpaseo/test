import { Body, Controller, Patch, Headers } from '@nestjs/common';
import { UpdateService } from './update.service';

@Controller('todolist')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Patch('/patch')
  async updateTodo(
    @Body()
    data: {
      id: string;
      afterGrop: string;
      afterTodo: string;
      afterStartDay: string;
      afterEndDay: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { id, afterGrop, afterTodo, afterStartDay, afterEndDay } = data;
    const token = authorization.substring('Bearer '.length);
    return this.updateService.updateTodo(
      token,
      id,
      afterGrop,
      afterTodo,
      afterStartDay,
      afterEndDay,
    );
  }
}
