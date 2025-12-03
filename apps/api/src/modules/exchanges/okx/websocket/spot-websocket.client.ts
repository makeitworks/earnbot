import { BaseWebsocketClient } from '../../core/websocket-client';
import { Ticker } from '../../common/types/ticker.type';
import { Kline } from '../../common/types/kline.type';

/**
 * OKX Spot WebSocket 客户端
 * API Key、Secret 和 Passphrase 可选，仅在需要用户数据流时使用
 */
export class OkxSpotWebsocketClient extends BaseWebsocketClient {
  private passphrase?: string;

  constructor(apiKey?: string, apiSecret?: string, passphrase?: string) {
    super('wss://ws.okx.com:8443/ws/v5/public', apiKey, apiSecret);
    this.passphrase = passphrase;
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

    const args = symbols.map((s) => ({
      channel: 'tickers',
      instId: s.replace('/', '-'),
    }));

    this.send({ op: 'subscribe', args });
    symbols.forEach((symbol) => {
      this.subscriptions.set(symbol, (data) => {
        callback(this.transformTicker(data));
      });
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

    const args = symbols.map((s) => ({
      channel: `candle${interval}`,
      instId: s.replace('/', '-'),
    }));

    this.send({ op: 'subscribe', args });
    symbols.forEach((symbol) => {
      this.subscriptions.set(`${symbol}:${interval}`, (data) => {
        callback(this.transformKline(symbol, interval, data));
      });
    });
  }

  /**
   * 处理收到的消息
   */
  protected handleMessage(data: any): void {
    try {
      const message = JSON.parse(data.toString());
      if (message.data && Array.isArray(message.data)) {
        message.data.forEach((item: any) => {
          const key = item.instId || item.symbol;
          const callback = this.subscriptions.get(key);
          if (callback) {
            callback(item);
          }
        });
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
      symbol: data.instId.replace('-', '/'),
      lastPrice: parseFloat(data.last),
      priceChangePercent: 0, // OKX需要额外计算
      highPrice: parseFloat(data.high24h),
      lowPrice: parseFloat(data.low24h),
      volume: parseFloat(data.volCcy24h),
      quoteAssetVolume: parseFloat(data.volCcy24h),
      timestamp: parseInt(data.ts),
      bidPrice: parseFloat(data.bid),
      bidQty: parseFloat(data.bidSz),
      askPrice: parseFloat(data.ask),
      askQty: parseFloat(data.askSz),
    };
  }

  /**
   * 转换K线数据
   */
  private transformKline(symbol: string, interval: string, data: any): Kline {
    const kline = data[0] || data;
    return {
      symbol,
      interval,
      openTime: parseInt(kline[0]),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: parseInt(kline[0]),
      quoteAssetVolume: parseFloat(kline[6]),
    };
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
