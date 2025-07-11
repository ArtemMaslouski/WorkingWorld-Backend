import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { UserInfoService } from 'src/user-info/user-info.service';
import { UserInfoModule } from 'src/user-info/user-info.module';

@Module({
  providers: [ChatGateway, ChatService, UserInfoService],
  controllers: [ChatController],
})
export class ChatModule {}
