import { Prisma } from '../../generated/prisma/client';
import { NotificationResponseDto } from './dto/notification-response.dto';

const notificationInclude = {} as const;

export type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: typeof notificationInclude;
}>;

export { notificationInclude };

export class NotificationMapper {
  static toDto(
    notification: NotificationWithRelations,
  ): NotificationResponseDto {
    return {
      id: notification.id,
      type: notification.type,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      userId: notification.userId,
    };
  }
}
