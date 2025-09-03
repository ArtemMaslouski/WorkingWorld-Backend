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
import { CreateMessageDTO } from './DTO/create-message-dto';

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
      // Берём токен из auth
      const token = client.handshake.auth?.token;
      if (!token) throw new UnauthorizedException('JWT token is missing');

      // Проверяем и декодируем JWT
      const payload = this.jwtService.verify(token);
      client.data.user = payload;

      this.logger.log(`Client connected: ${client.id} user ${payload.sub}`);
      this.logger.debug('Handshake token:', token, typeof token);
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
    this.logger.log(`Client ${client.id} joined room ${room}`);
    client.emit('joinedChat', { chatId: data.chatId });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createMessageDTO: CreateMessageDTO,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!client.data.user) {
        throw new UnauthorizedException('Unauthorized user');
      }

      const message = await this.chatService.createMessage(
        createMessageDTO,
        client.data.user.sub,
      );
      const room = `chat_${createMessageDTO.chatId}`;

      this.server.to(room).emit('newMessage', message);

      return { status: 'ok', message };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('errorMessage', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('sendInvitation')
  handleSendInvitation(
    @MessageBody() data: { userId: number; chatId: number },
  ) {
    const socketId = Array.from(this.server.sockets.sockets.values()).find(
      (sock) => sock.data.user && sock.data.user.sub === data.userId,
    )?.id;

    if (socketId) {
      this.server.to(socketId).emit('inviteToChat', { chatId: data.chatId });
      this.logger.log(`Invited user ${data.userId} to chat ${data.chatId}`);
    }
  }
}
