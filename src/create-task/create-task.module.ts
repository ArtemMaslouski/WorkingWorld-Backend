import { Module } from '@nestjs/common';
import { CreateTaskService } from './create-task.service';
import { CreateTaskController } from './create-task.controller';
import { PrismaService } from 'src/prisma.service';
import { UserInfoService } from 'src/user-info/user-info.service';

@Module({
  providers: [CreateTaskService, PrismaService, UserInfoService],
  controllers: [CreateTaskController],
})
export class CreateTaskModule {}
