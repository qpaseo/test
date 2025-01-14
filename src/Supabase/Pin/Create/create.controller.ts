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

@Controller('pin')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post('post')
  @UseInterceptors(FileInterceptor('img')) // 'img'는 요청에서 전달되는 파일의 키
  async create(
    @Body()
    data: {
      grop: string;
      field: string;
      pin: string;
      link: string;
    },
    @UploadedFile() img: Express.Multer.File, // 업로드된 파일
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { grop, field, pin, link } = data;
    const token = authorization.substring('Bearer '.length);
    return this.createService.createPin(token, grop, field, pin, link, img);
  }
}
