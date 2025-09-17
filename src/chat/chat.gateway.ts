import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) throw new UnauthorizedException('JWT token is missing');
      const payload = this.jwtService.verify(token);
      client.data.user = payload;

      // Присоединяем в приватную комнату пользователя для приглашений
      client.join(`user_${payload.sub}`);

      this.logger.log(`Client connected: ${client.id} user ${payload.sub}`);
    } catch (err) {
      this.logger.warn(`Connection refused: ${err.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `chat_${data.chatId}`;
    client.join(room);
    client.emit('joinedChat', { chatId: data.chatId });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { chatId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Проверка сокета');
    if (!client.data.user) throw new UnauthorizedException('Unauthorized');

    const senderId = Number(client.data.user.sub);
    const message = await this.chatService.createMessage(
      { chatId: data.chatId, content: data.content },
      senderId,
    );

    const room = `chat_${data.chatId}`;
    this.server.to(room).emit('newMessage', message);

    return { status: 'ok', message };
  }

  // Новый метод для приглашения пользователя в чат
  async inviteUserToChat(userId: number, chatId: number) {
    this.server.to(`user_${userId}`).emit('inviteToChat', { chatId });
  }
}
