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
      const token = client.handshake.auth?.token;
      if (!token) throw new UnauthorizedException('JWT token is missing');

      const payload = this.jwtService.verify(token);
      client.data.user = payload;

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
    this.logger.log(`Client ${client.id} joined room ${room}`);
    client.emit('joinedChat', { chatId: data.chatId });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createMessageDTO: CreateMessageDTO,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!client.data.user) throw new UnauthorizedException();

      const senderId = Number(client.data.user.sub);
      const message = await this.chatService.createMessage(
        createMessageDTO,
        senderId,
      );

      // Получаем всех участников чата
      const participants = await this.chatService.getChatParticipants(
        createMessageDTO.chatId,
      );

      participants.forEach((userId) => {
        const sock = Array.from(this.server.sockets.sockets.values()).find(
          (s) => s.data.user?.sub === userId,
        );
        if (sock) sock.emit('newMessage', message);
      });

      return { status: 'ok', message };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('errorMessage', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }
}
