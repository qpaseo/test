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
      group: string;
      name: string;
      state : string;
      todoStartDay: string;
      todoEndDay: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { group, name, state, todoStartDay, todoEndDay, } = data;
    const token = authorization.substring('Bearer '.length);
    return this.createService.createTodo(
      token,
      group,
      name,
      state,
      todoStartDay,
      todoEndDay,
    );
  }
}
