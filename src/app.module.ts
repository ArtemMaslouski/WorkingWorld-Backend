import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule } from '@nestjs/config';
import { CreateTaskModule } from './create-task/create-task.module';

@Module({
  imports: [AuthModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CreateTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
