import { Prisma } from '../../generated/prisma/client';
import {
  ConversationResponseDto,
  MessageResponseDto,
  ConversationParticipantResponseDto,
} from './dto/chat-response.dto';
import { UserMapper } from '../users/users.mapper';

const conversationInclude = {
  participants: {
    include: {
      user: {
        include: { profile: true },
      },
    },
  },
  messages: {
    take: 1,
    orderBy: { createdAt: 'desc' },
  },
} as const;

export type ConversationWithRelations = Prisma.ConversationGetPayload<{
  include: typeof conversationInclude;
}>;

export { conversationInclude };

export class ChatMapper {
  static toConversationDto(conversation: ConversationWithRelations): ConversationResponseDto {
    return {
      id: conversation.id,
      createdAt: conversation.createdAt,
      participants: conversation.participants.map(
        (p): ConversationParticipantResponseDto => ({
          userId: p.userId,
          profile: p.user.profile ? UserMapper.toProfileDto(p.user.profile) : undefined,
        }),
      ),
      messages: conversation.messages.map((m) => ChatMapper.toMessageDto(m as any)),
    };
  }

  static toMessageDto(message: Prisma.MessageGetPayload<{ include: { sender: { include: { profile: true } } } }>): MessageResponseDto {
    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      senderId: message.senderId,
      senderProfile: (message as any).sender?.profile
        ? UserMapper.toProfileDto((message as any).sender.profile)
        : undefined,
    };
  }
}
