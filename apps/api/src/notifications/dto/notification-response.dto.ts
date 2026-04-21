import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  userId!: string;
}
