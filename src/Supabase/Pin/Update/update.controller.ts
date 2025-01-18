import {
  Body,
  Controller,
  Patch,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateService } from './update.service';

@Controller('pin')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Patch('/patch')
  @UseInterceptors(FileInterceptor('img')) // 파일 업로드 처리
  async updateTodo(
    @Body()
    data: {
      id: string;
      afterGroup: string;
      afterField: string;
      afterPin: string;
      afterLink: string;
    },
    @Headers('Authorization') authorization: string,
    @UploadedFile() img: Express.Multer.File, // 업로드된 파일
  ): Promise<any> {
    const { id, afterGroup, afterField, afterPin, afterLink } = data;
    const token = authorization.substring('Bearer '.length);
    return this.updateService.updatePin(
      token,
      id,
      afterGroup,
      afterField,
      afterPin,
      afterLink,
      img,
    );
  }
}
