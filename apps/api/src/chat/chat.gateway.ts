import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token) as JwtPayload;
      client.data.user = payload;
      client.join(`user_${payload.sub}`);
    } catch (e) {
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as JwtPayload;
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
  handleJoinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`conv_${data.conversationId}`);
  }
}
