import { Prisma } from '../../generated/prisma/client';
import {
  ConversationResponseDto,
  MessageResponseDto,
  ConversationParticipantResponseDto,
} from './dto/chat-response.dto';
import { UserMapper } from '../users/users.mapper';

const messageInclude = {
  sender: {
    include: { profile: true },
  },
} as const;

export type MessageWithRelations = Prisma.MessageGetPayload<{
  include: typeof messageInclude;
}>;

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
    include: messageInclude,
  },
} as const;

export type ConversationWithRelations = Prisma.ConversationGetPayload<{
  include: typeof conversationInclude;
}>;

export { conversationInclude, messageInclude };

export class ChatMapper {
  static toConversationDto(
    conversation: ConversationWithRelations,
  ): ConversationResponseDto {
    return {
      id: conversation.id,
      createdAt: conversation.createdAt,
      participants: conversation.participants.map(
        (p): ConversationParticipantResponseDto => ({
          userId: p.userId,
          profile: p.user.profile
            ? UserMapper.toProfileDto(p.user.profile)
            : undefined,
        }),
      ),
      messages: conversation.messages.map((m) => ChatMapper.toMessageDto(m)),
    };
  }

  static toMessageDto(message: MessageWithRelations): MessageResponseDto {
    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      senderId: message.senderId,
      senderProfile: message.sender?.profile
        ? UserMapper.toProfileDto(message.sender.profile)
        : undefined,
    };
  }
}
