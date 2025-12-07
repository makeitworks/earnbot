import { Logger } from '@nestjs/common';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

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

  protected onOpenCallback: () => void;
  protected onCloseCallback: () => void;

  constructor(protected baseUrl: string) { }

  /**
   * 初始化，调用connect连接服务器
   */
  public initialize(): void {
    this.connect();
  }

  /**
   * 处理收到的消息
   */
  protected abstract handleMessage(data: WebSocket.Data): void;


  public registerOpenCloseCallbacks(onOpen: () => void, onClose: () => void) {
    this.onOpenCallback = onOpen;
    this.onCloseCallback = onClose;
  }

  /** 
   * websocket连接
  */
  protected onOpen(): void {
    if (this.onOpenCallback) {
      this.onOpenCallback();
    } else {
      throw new Error("no onOpen callback registered!");
    }
  }

  /**
   * websocket断开事件
   */
  protected onClose(): void {
    if (this.onCloseCallback) {
      this.onCloseCallback();
    } else {
      throw new Error("no onClose callback registered!");
    }
  }

  /**
   * 订阅
   */
  public subscribe(streamName: string, payload: Record<string, any>, callback: (data: any) => void): void {
    let sendMsg: Record<string, any> = {
      method: "SUBSCRIBE",
      ...payload,
      id: this.generateUUID(),
    }
    this.send(sendMsg)
    this.subscriptions.set(streamName, callback)
    this.logger.log(`subscribe ${streamName}`)
  }

  /**
   * 取消订阅
   */
  public unsubscribe(streamName: string, payload: Record<string, any>): void {
    let sendMsg: Record<string, any> = {
      method: 'UNSUBSCRIBE',
      ...payload,
      id: this.generateUUID()
    };
    this.send(sendMsg);
    this.subscriptions.delete(streamName);

    this.logger.log(`unsubscribe ${streamName}`)
  }

  /**
   * 生成唯一标识符
   */
  protected generateUUID(): string {
    return uuidv4();
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
          this.onOpen();
          this.reconnectAttempts = 0;
          this.setupPing();
          resolve();
        });

        this.ws.on('message', (data: WebSocket.Data) => {
          this.handleMessage(data);
        });

        this.ws.on('ping', (data: Buffer) => {
          this.handlePing(data);
        })

        this.ws.on('error', (error) => {
          this.logger.error('WebSocket error:', error);
          reject(error);
        });

        this.ws.on('close', () => {
          this.logger.log('WebSocket closed');
          this.onClose();
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
   * 处理 ping 消息，自动响应 pong
   * @param data Buffer
   */
  protected handlePing(data: Buffer): void {
    if (this.isConnected()) {
      this.ws!.pong();
    }
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
    }, 10000); // 每10秒发送一次ping
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
