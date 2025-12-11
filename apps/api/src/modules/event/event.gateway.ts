import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap: Map<string, string> = new Map();

  /**
   * 每个客户端连接时都会被调用
   */
  handleConnection(client: any, ...args: any[]) {
    
  }

  /**
   * 每个客户端断开连接时都会被调用
   */
  handleDisconnect(client: any) {
    const userId = [...this.userSocketMap.entries()]
      .find(([_, socketId]) => socketId === client.id)?.[0];

    if(userId) {
      this.userSocketMap.delete(userId);
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
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
    if(socketId) {
      this.server.to(socketId).emit(name, JSON.stringify(msg));
    }
  }
}
