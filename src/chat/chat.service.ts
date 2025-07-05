import { ForbiddenException, Injectable } from '@nestjs/common';
import { Message, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async createChatBetweenUsers(userId1: number, userId2) {
    //Проверка что пользователи не совпадают
    if (userId1 === userId2) {
      throw new ForbiddenException('Нельзя создать чат с самим собой');
    }

    //Проверка существует ли такой чат уже между двумя пользователями
    const existingChat = await this.prismaService.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } },
        ],
      },
      include: { participants: true },
    });

    if (existingChat && existingChat.participants.length === 2) {
      return existingChat;
    }

    const chat = await this.prismaService.chat.create({
      data: {
        participants: {
          create: [
            { user: { connect: { id: userId1 } } },
            { user: { connect: { id: userId2 } } },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return chat;
  }
}
