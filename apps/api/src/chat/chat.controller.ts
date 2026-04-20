import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all my conversations' })
  getConversations(@CurrentUser() user: any) {
    return this.chatService.getConversations(user.id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  getMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start a new conversation' })
  createConversation(@CurrentUser() user: any, @Body() data: { participantId: string }) {
    return this.chatService.createConversation([user.id, data.participantId]);
  }
}
