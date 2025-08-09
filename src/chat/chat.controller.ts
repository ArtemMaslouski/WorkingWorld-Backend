import {
  Controller,
  Body,
  Post,
  Get,
  Request,
  Req,
  Res,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './DTO/create-chat-dto';
import { Request as RequestExpress } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerResponses } from 'src/auth/configs/swagger-responses.config';
import { CreateMessageDTO } from './DTO/create-message-dto';
import { UserInfoService } from '../user-info/user-info.service';
import { GetMessageDTO } from './DTO/get-message-dto';

@Controller('chats')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userInfoService: UserInfoService,
  ) {}

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
  async createMessage(@Req() req, @Body() createMessageDto: CreateMessageDTO) {
    const token = req.cookies['access_token'];
    return this.chatService.createMessage(createMessageDto, token);
  }

  @ApiOperation({
    summary: 'Посмотреть сообщения в чате',
    description:
      'Данная функция позволяет получить сообшения из чата по его id',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.serverError)
  @ApiResponse(SwaggerResponses.notFound)
  @Get('getMessages/:id')
  async getMessages(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const token = req.cookies['access_token'];
    return this.chatService.getAllMessages(id, token);
  }
}
