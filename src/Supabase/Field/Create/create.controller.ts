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
  @UseInterceptors(FileInterceptor('img')) 
  async create(
    @Body()
    data: {
      group: string;
      field: string;
    },
    @Headers('Authorization') authorization: string,
    @UploadedFile() img: Express.Multer.File, 
  ): Promise<any> {
    const { group, field } = data;
    const token = authorization.substring('Bearer '.length);
    return this.createService.createField(token, group, field, img);
  }
}
