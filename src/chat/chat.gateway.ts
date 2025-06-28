import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { SendMessage } from './DTO/send-message-DTO';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() dto: SendMessage,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.sendMessage(
      dto.chatId,
      dto.senderId,
      dto.content,
    );

    this.server.to(`chat-${dto.chatId}`).emit('recieve_message', message);

    return message;
  }

  @SubscribeMessage('joinChat')
  async joinChat(
    @MessageBody() chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`chat-${chatId}`);
  }
}
