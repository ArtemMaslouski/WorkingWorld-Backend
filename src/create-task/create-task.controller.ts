import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Request,
} from '@nestjs/common';
import { createTaskDTO } from './DTO/create-task-DTO';
import { CreateTaskService } from './create-task.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerResponses } from 'src/auth/configs/swagger-responses.config';
import { deleteTaskDTO } from './DTO/delete-task-DTO';

@Controller('tasks')
export class CreateTaskController {
  constructor(private createTaskService: CreateTaskService) {}

  @ApiOperation({
    summary: 'Функция для создания задания',
    description:
      'Функция позволяет создать задание на основе Категории,подкатегории,Адреса,Описания и временных промежутков',
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('create')
  async createTask(@Body() taskDTO: createTaskDTO, @Request() req) {
    const token = req.cookies['access_token'];
    console.log(token);
    return this.createTaskService.createTask(taskDTO, token);
  }

  @ApiOperation({
    summary: 'Функция для получения списка заданий',
    description: 'Функция позволяет получить список заданий',
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Get('get')
  async getTasks() {
    return this.createTaskService.getTasks();
  }

  @ApiOperation({
    summary: 'Функция для удаления задания',
    description: 'Функция позволяет удалить задания исходя из его id',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Delete('delete')
  async deleteTask(@Body() deleteDTO: deleteTaskDTO) {
    return this.createTaskService.deleteTask(deleteDTO);
  }

  @ApiOperation({
    summary: 'Функция для удаления задания',
    description: 'Функция позволяет удалить задания исходя из его id',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Put('refresh/:id')
  async refreshData(
    @Param('id') id: string,
    @Body() refreshData: createTaskDTO,
  ) {
    let idInNumber = +id;
    return await this.createTaskService.resetTaskData(idInNumber, refreshData);
  }

  @Get('userTask')
  async getUsersTask(@Request() req) {
    const token = req.cookies['access_token'];

    return await this.createTaskService.getUserTask(token);
  }
}
