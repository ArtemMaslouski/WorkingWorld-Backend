import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { UserInfoService } from 'src/user-info/user-info.service';
import { UserInfoModule } from 'src/user-info/user-info.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ChatGateway, ChatService, UserInfoService],
  controllers: [ChatController],
})
export class ChatModule {}
