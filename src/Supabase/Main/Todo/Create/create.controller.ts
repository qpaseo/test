import {
  Body,
  Headers,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateService } from './create.service';

@Injectable()
@Controller('todolist')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post('post')
  async create(
    @Body()
    data: {
      grop: string;
      todo: string;
      todoStartDay: string;
      todoEndDay: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { grop, todo, todoStartDay, todoEndDay } = data;
    const token = authorization.substring('Bearer '.length);
    return this.createService.createTodo(
      token,
      grop,
      todo,
      todoStartDay,
      todoEndDay,
    );
  }
}
