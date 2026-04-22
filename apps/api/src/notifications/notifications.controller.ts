import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationMapper } from './notifications.mapper';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all my notifications' })
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findAll(
    @CurrentUser() user: JwtPayload,
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationsService.findAll(user.sub);
    return notifications.map((n) => NotificationMapper.toDto(n));
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.markAsRead(
      id,
      user.sub,
    );
    return NotificationMapper.toDto(notification);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, type: SuccessResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async markAllAsRead(
    @CurrentUser() user: JwtPayload,
  ): Promise<SuccessResponseDto> {
    await this.notificationsService.markAllAsRead(user.sub);
    return { message: 'All notifications marked as read' };
  }
}
