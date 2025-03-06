import { Controller, Body, Post, Get } from '@nestjs/common';
import { createTaskDTO } from './DTO/create-task-DTO';
import { CreateTaskService } from './create-task.service';

@Controller('create-task')
export class CreateTaskController {
  constructor(private createTaskService: CreateTaskService) {}

  @Post('create')
  async createTask(@Body() taskDTO: createTaskDTO) {
    return this.createTaskService.createTask(taskDTO);
  }

  @Get('get')
  async getTasks() {
    return this.createTaskService.getTasks();
  }
}
