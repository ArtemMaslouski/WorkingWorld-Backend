import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { CreateMessageDTO } from './DTO/create-message-dto';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private prismaService: PrismaService,
    private chatService: ChatService,
  ) {}
  private logger = new Logger('ChatGateway');

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client ${client.id} initialized`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  //Реализация присоединения пользователя к чату
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `chat_${data.chatId}`;

    client.join(room);
    this.logger.log(`Client ${client.id} joined ${room}`);
    client.emit('joinedChat', { chatId: data.chatId });
  }

  //Реализация отправки сообщения другому пользователю
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createMessageDTO: CreateMessageDTO,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.chatService.createMessage(createMessageDTO);

      const room = `chat_${createMessageDTO.chatId}`;

      this.server.to(room).emit('newMessage', message);

      return { status: 'ok', message };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);

      client.emit('errorMessage', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }
}
