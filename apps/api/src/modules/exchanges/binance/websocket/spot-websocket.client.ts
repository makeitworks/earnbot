import { BaseWebsocketClient } from '../../core/websocket-client';
import { Ticker } from '../../common/types/ticker.type';
import { Kline } from '../../common/types/kline.type';

/**
 * Binance Spot WebSocket 客户端
 * API Key 和 Secret 可选，仅在需要用户数据流时使用
 */
export class BinanceSpotWebsocketClient extends BaseWebsocketClient {
  private tickerCallbacks: Map<string, (ticker: Ticker) => void> = new Map();
  private klineCallbacks: Map<string, (kline: Kline) => void> = new Map();

  constructor(apiKey?: string, apiSecret?: string) {
    super('wss://stream.binance.com:9443/ws', apiKey, apiSecret);
  }

  /**
   * 订阅行情数据
   */
  async subscribeTicker(
    symbols: string[],
    callback: (ticker: Ticker) => void,
  ): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }

    symbols.forEach((symbol) => {
      const stream = `${symbol.toLowerCase()}@ticker`;
      this.subscribe(stream, (data) => {
        callback(this.transformTicker(data));
      });
      this.tickerCallbacks.set(symbol, callback);
    });
  }

  /**
   * 订阅K线数据
   */
  async subscribeKline(
    symbols: string[],
    interval: string,
    callback: (kline: Kline) => void,
  ): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }

    symbols.forEach((symbol) => {
      const stream = `${symbol.toLowerCase()}@klines_${interval}`;
      this.subscribe(stream, (data) => {
        callback(this.transformKline(data.k));
      });
      this.klineCallbacks.set(`${symbol}:${interval}`, callback);
    });
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
