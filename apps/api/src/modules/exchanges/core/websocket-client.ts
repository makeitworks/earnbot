import { Logger } from '@nestjs/common';
import WebSocket from 'ws';

/**
 * WebSocket 客户端基类
 * 提供 WebSocket 连接的通用功能
 * API Key 和 Secret 可选，仅在需要用户数据流时使用
 */
export abstract class BaseWebsocketClient {
  protected logger = new Logger(this.constructor.name);
  protected ws: WebSocket | null = null;
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = 5;
  protected reconnectDelay = 3000; // 3秒
  protected subscriptions: Map<string, (data: any) => void> = new Map();
  protected isManualClose = false;
  protected hasCredentials: boolean;

  constructor(
    protected baseUrl: string,
    protected apiKey?: string,
    protected apiSecret?: string,
  ) {
    this.hasCredentials = !!(apiKey && apiSecret);
  }

  /**
   * 连接到WebSocket服务器
   */
  protected async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.baseUrl);

        this.ws.on('open', () => {
          this.logger.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.setupPing();
          resolve();
        });

        this.ws.on('message', (data: WebSocket.Data) => {
          this.handleMessage(data);
        });

        this.ws.on('error', (error) => {
          this.logger.error('WebSocket error:', error);
          reject(error);
        });

        this.ws.on('close', () => {
          this.logger.log('WebSocket closed');
          if (!this.isManualClose) {
            this.reconnect();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 处理收到的消息
   */
  protected abstract handleMessage(data: WebSocket.Data): void;

  /**
   * 订阅消息
   */
  protected subscribe(topic: string, callback: (data: any) => void): void {
    this.subscriptions.set(topic, callback);
    this.logger.log(`Subscribed to ${topic}`);
  }

  /**
   * 取消订阅
   */
  protected unsubscribe(topic: string): void {
    this.subscriptions.delete(topic);
    this.logger.log(`Unsubscribed from ${topic}`);
  }

  /**
   * 设置心跳
   */
  private setupPing(): void {
    if (!this.ws) return;

    const interval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      } else {
        clearInterval(interval);
      }
    }, 30000); // 每30秒发送一次ping
  }

  /**
   * 重新连接
   */
  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    this.logger.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        this.logger.error('Reconnect failed:', error);
      });
    }, delay);
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 检查连接状态
   */
  protected isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * 发送消息
   */
  protected send(message: Record<string, any>): void {
    if (this.isConnected()) {
      this.ws!.send(JSON.stringify(message));
    } else {
      this.logger.warn('WebSocket is not connected');
    }
  }
}
