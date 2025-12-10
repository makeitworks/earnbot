import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  /**
   * 每个客户端连接时都会被调用
   */
  handleConnection(client: any, ...args: any[]) {
    
  }

  /**
   * 每个客户端断开连接时都会被调用
   */
  handleDisconnect(client: any) {
    
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  /**
   * 向客户端广播
   */
  broadcast(name: string, msg: any) {
    this.server
  }
}
