import { BaseWebsocketClient } from '../../core/websocket-client';
import { Ticker } from '../../common/types/ticker.type';
import { Kline } from '../../common/types/kline.type';
import {
  BinanceSpotWebsocketStreamEnum,
  BinanceStreamType,
  DepthLevelEnum,
  DepthUpdateSpeedEnum,
  KlineIntervalEnum,
} from '../../common/enums/binance/spot-websocket-api.enum';

/**
 * Binance Spot WebSocket行情推送 客户端
 * 不需要API Key 和 Secret, 仅用于公共市场数据
 */
export class BinanceMarketWebsocketClient extends BaseWebsocketClient {
  constructor() {
    super('wss://stream.binance.com:9443/ws');
  }

  /**
   * 订阅行情数据流
   */
  async subscribeTicker(
    symbols: string[],
    callback: (data: any) => void,
  ): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }

    const params = symbols.map(
      (s) => `${s.toLowerCase()}@${BinanceSpotWebsocketStreamEnum.TICKER}`,
    );
    const requestId = `${params}_${this.generateUUID()}`;

    const payload: Record<string, any> = {
      method: BinanceStreamType.SUBSCRIBE,
      params: params,
      id: requestId,
    };
    this.subscriptions.set('24hrTicker', callback);
    this.send(payload);
  }

  /**
   * 订阅逐笔交易数据流
   */
  async subscribeTrade(
    symbols: string[],
    callback: (data: any) => void,
  ): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }

    const params = symbols.map(
      (s) => `${s.toLowerCase()}@${BinanceSpotWebsocketStreamEnum.TRADE}`,
    );
    const requestId = `${params}_${this.generateUUID()}`;

    const payload: Record<string, any> = {
      method: BinanceStreamType.SUBSCRIBE,
      params: params,
      id: requestId,
    };
    this.subscriptions.set(BinanceSpotWebsocketStreamEnum.TRADE, callback);
    this.send(payload);
  }

  /**
   * 订阅K线数据流
   */
  async subscribeKline(
    symbols: string[],
    interval: KlineIntervalEnum,
    callback: (data: any) => void,
  ): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }

    const params = symbols.map(
      (s) =>
        `${s.toLowerCase()}@${BinanceSpotWebsocketStreamEnum.KLINE}_${interval}`,
    );
    const requestId = `${params}_${this.generateUUID()}`;
    const payload: Record<string, any> = {
      method: BinanceStreamType.SUBSCRIBE,
      params: params,
      id: requestId,
    };
    this.subscriptions.set(BinanceSpotWebsocketStreamEnum.KLINE, callback);
    this.send(payload);
  }

  /**
   * 订阅平均价格数据流
   */
  async subscribeAvgPrice(
    symbols: string[],
    callback: (data: any) => void,
  ): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }
    const params = symbols.map(
      (s) => `${s.toLowerCase()}@${BinanceSpotWebsocketStreamEnum.AVG_PRICE}`,
    );
    const requestId = `${params}_${this.generateUUID()}`;
    const payload: Record<string, any> = {
      method: BinanceStreamType.SUBSCRIBE,
      params: params,
      id: requestId,
    };
    this.subscriptions.set(BinanceSpotWebsocketStreamEnum.AVG_PRICE, callback);
    this.send(payload);
  }

  /**
   * 订阅深度数据流
   */
  async subscribeDepth(
    symbols: string[],
    level: DepthLevelEnum,
    speed: DepthUpdateSpeedEnum,
    callback: (data: any) => void,
  ): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }

    const params = symbols.map(
      (s) =>
        `${s.toLowerCase()}@${BinanceSpotWebsocketStreamEnum.DEPTH}${level}@${speed}`,
    );
    const requestId = `${params}_${this.generateUUID()}`;
    const payload: Record<string, any> = {
      method: BinanceStreamType.SUBSCRIBE,
      params: params,
      id: requestId,
    };
    this.subscriptions.set(BinanceSpotWebsocketStreamEnum.DEPTH, callback);
    this.send(payload);
  }

  /**
   * 处理收到的消息
   */
  protected handleMessage(data: any): void {
    try {
      const message = JSON.parse(data.toString());
      const stream = message.stream;
      const payload = message.data;

      const callback = this.subscriptions.get(stream);
      if (callback) {
        callback(payload);
      }
    } catch (error) {
      this.logger.error('Failed to handle message:', error);
    }
  }

  /**
   * 转换行情数据
   */
  private transformTicker(data: any): Ticker {
    return {
      symbol: data.s,
      lastPrice: parseFloat(data.c),
      priceChangePercent: parseFloat(data.P),
      highPrice: parseFloat(data.h),
      lowPrice: parseFloat(data.l),
      volume: parseFloat(data.v),
      quoteAssetVolume: parseFloat(data.q),
      timestamp: data.E,
      bidPrice: parseFloat(data.b),
      bidQty: parseFloat(data.B),
      askPrice: parseFloat(data.a),
      askQty: parseFloat(data.A),
    };
  }

  /**
   * 转换K线数据
   */
  private transformKline(data: any): Kline {
    return {
      symbol: data.s,
      interval: data.i,
      openTime: data.t,
      open: parseFloat(data.o),
      high: parseFloat(data.h),
      low: parseFloat(data.l),
      close: parseFloat(data.c),
      volume: parseFloat(data.v),
      closeTime: data.T,
      quoteAssetVolume: parseFloat(data.q),
      numberOfTrades: data.n,
      takerBuyBaseAssetVolume: parseFloat(data.V),
      takerBuyQuoteAssetVolume: parseFloat(data.Q),
    };
  }
}
