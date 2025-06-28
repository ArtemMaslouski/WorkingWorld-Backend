import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async sendMessage(chatId: number, senderId: number, content: string) {
    return await this.prismaService.message.create({
      data: {
        chatId,
        content,
        senderId,
      },
      include: {
        sender: true,
      },
    });
  }

  async getMessages(chatId: number) {
    return await this.prismaService.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: { sender: true },
    });
  }
}
