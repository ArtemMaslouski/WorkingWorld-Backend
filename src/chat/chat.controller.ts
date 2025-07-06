import { Controller, Body, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './DTO/create-chat-dto';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('create')
  async createTask(@Body() createChatDto: CreateChatDTO) {
    const { userId1, userId2 } = createChatDto;
    return await this.chatService.createChatBetweenUsers(userId1, userId2);
  }
}
