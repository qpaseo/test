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
import { DeleteService } from './delete.service';

@Controller('todolist')
export class DeleteController {
  constructor(private readonly deleteService: DeleteService) {}

  @Delete('/delete')
  async create(
    @Body()
    data: {
      grop: string;
      id: string;
    },
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    const { grop, id } = data;
    const token = authorization.substring('Bearer '.length);
    return this.deleteService.deleteTodo(token, grop, id);
  }
}
