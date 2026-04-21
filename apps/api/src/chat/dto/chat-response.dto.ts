import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDto } from '../../users/dto/user-response.dto';

export class MessageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  senderId!: string;

  @ApiProperty({ type: ProfileResponseDto, required: false })
  senderProfile?: ProfileResponseDto;
}

export class ConversationParticipantResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty({ type: ProfileResponseDto, required: false })
  profile?: ProfileResponseDto;
}

export class ConversationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: [ConversationParticipantResponseDto] })
  participants!: ConversationParticipantResponseDto[];

  @ApiProperty({ type: [MessageResponseDto], required: false })
  messages?: MessageResponseDto[];
}
