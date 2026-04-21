import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ConversationResponseDto, MessageResponseDto } from './dto/chat-response.dto';
import { ChatMapper } from './chat.mapper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all my conversations' })
  @ApiResponse({ status: 200, type: [ConversationResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getConversations(@CurrentUser() user: JwtPayload): Promise<ConversationResponseDto[]> {
    const conversations = await this.chatService.getConversations(user.sub);
    return conversations.map((c) => ChatMapper.toConversationDto(c));
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation CUID' })
  @ApiResponse({ status: 200, type: [MessageResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getMessages(@Param('id') id: string): Promise<MessageResponseDto[]> {
    const messages = await this.chatService.getMessages(id);
    return messages.map((m) => ChatMapper.toMessageDto(m as any));
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start a new conversation' })
  @ApiResponse({ status: 201, type: ConversationResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async createConversation(
    @CurrentUser() user: JwtPayload,
    @Body() data: { participantId: string },
  ): Promise<ConversationResponseDto> {
    const conversation = await this.chatService.createConversation([
      user.sub,
      data.participantId,
    ]);
    return ChatMapper.toConversationDto(conversation);
  }
}
