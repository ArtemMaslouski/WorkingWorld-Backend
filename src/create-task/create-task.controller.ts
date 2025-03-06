import { Controller, Body, Post, Get } from '@nestjs/common';
import { createTaskDTO } from './DTO/create-task-DTO';
import { CreateTaskService } from './create-task.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerResponses } from 'src/auth/configs/swagger-responses.config';

@Controller('create-task')
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
  async createTask(@Body() taskDTO: createTaskDTO) {
    return this.createTaskService.createTask(taskDTO);
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
}
