import { Controller, Body, Post, Get, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './DTO/create-chat-dto';
import { Request as RequestExpress } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerResponses } from 'src/auth/configs/swagger-responses.config';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('create')
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
    return await this.chatService.getUserChats(token);
  }
}
