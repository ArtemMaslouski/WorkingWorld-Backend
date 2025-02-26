import { Body, Injectable } from '@nestjs/common';
import { createTaskDTO } from './DTO/create-task-DTO';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CreateTaskService {
  constructor(private prisma: PrismaService) {}
  async createTask(@Body() createTaskDTO: createTaskDTO) {
    const { Title, Address, BeginAt, EndAt, Description, Cost } = createTaskDTO;
    return this.prisma.task.create({
      data: {
        Title: Title,
        Address: Address,
        BeginAt: BeginAt,
        EndAt: EndAt,
        Description: Description,
        Cost: Cost,
      },
    });
  }
}
