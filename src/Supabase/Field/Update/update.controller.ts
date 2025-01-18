import {
  Body,
  Controller,
  Patch,
  Headers,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateService } from './update.service';

@Controller('field')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Patch('/patch')
  @UseInterceptors(FileInterceptor('img'))
  async updateTodo(
    @Body()
    data: {
      id: string;
      afterGroup: string;
      afterField: string;
    },
    @Headers('Authorization') authorization: string,
    @UploadedFile() img: Express.Multer.File,
  ): Promise<any> {
    const { id, afterGroup, afterField } = data;
    const token = authorization.substring('Bearer '.length);
    return this.updateService.updateField(
      token,
      id,
      afterGroup,
      afterField,
      img,
    );
  }
}
