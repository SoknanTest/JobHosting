import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationGateway } from './notifications.gateway';
import {
  NotificationMapper,
  NotificationWithRelations,
} from './notifications.mapper';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationGateway,
  ) {}

  async create(
    userId: string,
    type: string,
    message: string,
  ): Promise<NotificationWithRelations> {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        message,
      },
    });

    const dto = NotificationMapper.toDto(notification);
    this.gateway.sendNotification(userId, dto);
    return notification;
  }

  async findAll(userId: string): Promise<NotificationWithRelations[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(
    id: string,
    userId: string,
  ): Promise<NotificationWithRelations> {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
