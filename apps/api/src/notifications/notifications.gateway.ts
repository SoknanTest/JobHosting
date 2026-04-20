import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: 'notifications',
  cors: { origin: '*' },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      client.join(`user_${payload.sub}`);
    } catch (e) {
      client.disconnect();
    }
  }

  sendNotification(userId: string, data: any) {
    this.server.to(`user_${userId}`).emit('newNotification', data);
  }
}
