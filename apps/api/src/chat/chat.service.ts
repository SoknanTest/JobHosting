import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  conversationInclude,
  ConversationWithRelations,
  messageInclude,
  MessageWithRelations,
} from './chat.mapper';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string): Promise<ConversationWithRelations[]> {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: conversationInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMessages(conversationId: string): Promise<MessageWithRelations[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: messageInclude,
    });
  }

  async createConversation(
    participantIds: string[],
  ): Promise<ConversationWithRelations> {
    return this.prisma.conversation.create({
      data: {
        participants: {
          create: participantIds.map((userId) => ({ userId })),
        },
      },
      include: conversationInclude,
    });
  }
}
