import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private guestId: string = 'guest_';

  private userSocketMap: Map<string, string> = new Map();

  private logger : Logger = new Logger(EventGateway.name);

  constructor(
    private jtwService: JwtService,
    private configService: ConfigService,
  ) { }

  /**
   * 每个客户端连接时都会被调用
   */
  handleConnection(client: any, ...args: any[]) {
    this.userSocketMap.set(`${this.guestId}${client.id}`, client.id);
  }

  /**
   * 每个客户端断开连接时都会被调用
   */
  handleDisconnect(client: any) {
    const userId = [...this.userSocketMap.entries()]
      .find(([_, socketId]) => socketId === client.id)?.[0];

    if (userId) {
      this.userSocketMap.delete(userId);
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('auth')
  async handleAuth(client: any, token: string) {
    // 验证token
    try {
      const payload = await this.jtwService.verifyAsync(token, { secret: this.configService.get<string>('JWT_SECRET') });
      // 绑定
      this.userSocketMap.set(payload.sub, client.id);

      // 移除之前的socket
      this.userSocketMap.delete(`${this.guestId}${client.id}`);
    } catch {
      this.logger.error(`[${client.id}] auth failed: ${token}`);
    }
  }

  /**
   * 向客户端广播
   */
  broadcast(name: string, msg: any) {
    this.server.emit(name, JSON.stringify(msg));
  }

  /**
   * 向指定用户发送消息
   */
  sendToUser(userId: string, name: string, msg: any) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(name, JSON.stringify(msg));
    }
  }
}
