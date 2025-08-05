import { Controller, Body, Post, Get, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './DTO/create-chat-dto';
import { Request as RequestExpress } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerResponses } from 'src/auth/configs/swagger-responses.config';
import { CreateMessageDTO } from './DTO/create-message-dto';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('createChat')
  async createTask(@Body() createChatDto: CreateChatDTO) {
    const { userId1, userId2 } = createChatDto;
    return await this.chatService.createChatBetweenUsers(userId1, userId2);
  }

  @ApiOperation({
    summary: 'Получить все чаты пользователя',
    description:
      'Функция позволяет получить все чаты пользователя, принимая токен из куков ',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Get('get-chats')
  async getChats(@Request() req: RequestExpress) {
    const token = req.cookies['access_token'];
    console.log(req.cookies['access_token']);
    console.log(token);
    return await this.chatService.getUserChats(token);
  }

  @ApiOperation({
    summary: 'Создать сообщение в чате',
    description:
      'Данная функция создает сообщение в чате используя senderId, chatId и содержание сообщения',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.notFound)
  @Post('createMessage')
  async createMessage(@Body() createMessageDto: CreateMessageDTO) {
    return this.chatService.createMessage(createMessageDto);
  }
}
