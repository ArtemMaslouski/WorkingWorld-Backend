import { Body, Injectable } from '@nestjs/common';
import { createTaskDTO } from './DTO/create-task-DTO';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CreateTaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(@Body() createTaskDTO: createTaskDTO) {
    const { Category, Subcategory, Address, BeginAt, EndAt, Description } =
      createTaskDTO;
    return this.prisma.task.create({
      data: {
        Category: Category,
        Subcategory: Subcategory,
        Address: Address,
        BeginAt: BeginAt,
        EndAt: EndAt,
        Description: Description,
      },
    });
  }

  async getTasks() {
    return await this.prisma.task.findMany();
  }
}
