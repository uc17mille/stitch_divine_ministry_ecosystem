import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async getMyConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
    });

    return messages;
  }

  async getAllMessagesForAdmin() {
    return this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async markAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }
}
