import {
  Body,
  Headers,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateService } from './create.service';

@Controller('field')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post('post')
  @UseInterceptors(FileInterceptor('img')) // 파일 업로드 처리
  async create(
    @Body()
    data: {
      grop: string;
      field: string;
    },
    @Headers('Authorization') authorization: string,
    @UploadedFile() img: Express.Multer.File, // 업로드된 파일
  ): Promise<any> {
    const { grop, field } = data;
    const token = authorization.substring('Bearer '.length);
    return this.createService.createField(token, grop, field, img);
  }
}
