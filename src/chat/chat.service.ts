import { ForbiddenException, Injectable } from '@nestjs/common';
import { Message, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDTO } from './DTO/create-message-dto';
import { UserInfoService } from '../user-info/user-info.service';
import { GetMessageDTO } from './DTO/get-message-dto';

@Injectable()
export class ChatService {
  constructor(
    private prismaService: PrismaService,
    private userInfoService: UserInfoService,
  ) {}

  //Создание чата между двумя пользователями
  async createChatBetweenUsers(userId1: number, userId2: number) {
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

  //Создание сообщения в чате
  // chat.service.ts
  async createMessage(data: CreateMessageDTO, senderId: number) {
    const { chatId, content } = data;

    // Проверка, что пользователь состоит в этом чате
    const participant = await this.prismaService.chatParticipant.findUnique({
      where: {
        userId_chatId: {
          chatId,
          userId: senderId,
        },
      },
    });

    if (!participant) {
      throw new ForbiddenException('Пользователь не является участником чата');
    }

    const message = await this.prismaService.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            UserName: true,
          },
        },
      },
    });

    return message;
  }

  //Получить сообщения исходя из определенного чата
  async getAllMessages(chatId: number, token: string) {
    const { sub: userIdStr } = await this.userInfoService.verifyUser(token);
    const userId = Number(userIdStr);

    const participant = await this.prismaService.chatParticipant.findUnique({
      where: {
        userId_chatId: {
          chatId,
          userId,
        },
      },
    });

    if (!participant) {
      throw new ForbiddenException('Пользователь не является участником чата');
    }

    const messages = await this.prismaService.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            UserName: true,
          },
        },
      },
    });

    return messages;
  }

  async getUserChats(token: string) {
    console.log(token);
    const { sub: userId } = this.userInfoService.verifyUser(token);

    const chats = await this.prismaService.chat.findMany({
      where: {
        participants: {
          some: {
            userId: +userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                UserName: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                UserName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return chats;
  }

  async getChatParticipants(chatId: number): Promise<number[]> {
    const participants = await this.prismaService.chatParticipant.findMany({
      where: { chatId },
      select: { userId: true },
    });

    return participants.map((p) => p.userId);
  }
}
