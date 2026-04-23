import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth.token as string | undefined;

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.data.user = payload;
      await client.join(`user_${payload.sub}`);
      this.logger.log(
        `Client ${client.id} (user: ${payload.sub}) connected to chat`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Chat authentication failed for client ${client.id}: ${errorMessage}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client ${client.id} disconnected from chat`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const user: JwtPayload = client.data.user;
    if (!user) return;
    const senderId = user.sub;

    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        conversationId: data.conversationId,

        senderId,
      },
      include: {
        sender: {
          select: {
            profile: true,
          },
        },
      },
    });

    // Broadcast to conversation room
    this.server.to(`conv_${data.conversationId}`).emit('newMessage', message);

    return message;
  }
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`conv_${data.conversationId}`);
  }
}
