import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CreateTaskModule } from './create-task/create-task.module';
import { UserInfoService } from './user-info/user-info.service';
import { UserInfoController } from './user-info/user-info.controller';
import { UserInfoModule } from './user-info/user-info.module';
import { ChatGateway } from './chat/chat.gateway'
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CreateTaskModule,
    UserInfoModule,
    ChatGateway,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
