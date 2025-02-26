import { Module } from '@nestjs/common';
import { CreateTaskService } from './create-task.service';
import { CreateTaskController } from './create-task.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CreateTaskService, PrismaService],
  controllers: [CreateTaskController],
})
export class CreateTaskModule {}
