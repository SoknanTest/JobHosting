import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationGateway } from './notifications.gateway';

@Global()
@Module({
  imports: [JwtModule],
  providers: [NotificationsService, NotificationGateway],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
