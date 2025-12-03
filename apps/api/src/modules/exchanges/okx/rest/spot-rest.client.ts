import { BaseRestClient } from '../../core/rest-client';
import { Ticker } from '../../common/types/ticker.type';
import { Kline } from '../../common/types/kline.type';
import * as crypto from 'crypto';

/**
 * OKX Spot REST API 客户端
 * API Key、Secret 和 Passphrase 可选，仅在需要签名的请求时使用
 */
export class OkxSpotRestClient extends BaseRestClient {
  private passphrase?: string;

  constructor(apiKey?: string, apiSecret?: string, passphrase?: string) {
    super('https://www.okx.com/api/v5', apiKey, apiSecret);
    this.passphrase = passphrase;
  }

  /**
   * 获取行情数据
   */
  async getTicker(symbol: string): Promise<Ticker> {
    const instId = this.transformSymbol(symbol);
    const data = await this.get('/market/ticker', { instId });
    return this.transformTicker(data.data[0]);
  }

  /**
   * 批量获取行情数据
   */
  async getTickers(symbols?: string[]): Promise<Ticker[]> {
    const instIds = symbols?.map((s) => this.transformSymbol(s)).join(',');
    const data = await this.get('/market/tickers', { instType: 'SPOT', instIds });
    return data.data.map((t: any) => this.transformTicker(t));
  }

  /**
   * 获取K线数据
   */
  async getKlines(
    symbol: string,
    interval: string,
    limit: number = 100,
  ): Promise<Kline[]> {
    const instId = this.transformSymbol(symbol);
    const data = await this.get('/market/candles', { instId, bar: interval, limit });
    return data.data.map((k: any) => this.transformKline(symbol, interval, k));
  }

  /**
   * 获取交易对信息
   */
  async getSymbolInfo(symbol: string): Promise<Record<string, any>> {
    const instId = this.transformSymbol(symbol);
    const data = await this.get('/public/instruments', { instType: 'SPOT', instId });
    return data.data[0] || null;
  }

  /**
   * 获取所有交易对信息
   */
  async getExchangeInfo(): Promise<Record<string, any>> {
    const data = await this.get('/public/instruments', { instType: 'SPOT' });
    return { instruments: data.data };
  }

  /**
   * 下单（现货）
   */
  async placeOrder(order: Record<string, any>): Promise<Record<string, any>> {
    const payload = {
      instId: this.transformSymbol(order.symbol),
      tdMode: 'cash',
      side: order.side.toLowerCase(),
      ordType: order.type.toLowerCase(),
      sz: order.quantity,
      ...(order.price && { px: order.price }),
    };

    return this.signAndRequest('/trade/order', 'POST', payload);
  }

  /**
   * 取消订单
   */
  async cancelOrder(symbol: string, orderId: string): Promise<Record<string, any>> {
    const payload = {
      ordId: orderId,
      instId: this.transformSymbol(symbol),
    };
    return this.signAndRequest('/trade/cancel-order', 'POST', payload);
  }

  /**
   * 查询订单
   */
  async getOrder(symbol: string, orderId: string): Promise<Record<string, any>> {
    const data = await this.signAndRequest('/trade/order', 'GET', {
      ordId: orderId,
      instId: this.transformSymbol(symbol),
    });
    return data.data[0];
  }

  /**
   * 获取当前委托单
   */
  async getOpenOrders(symbol?: string): Promise<Record<string, any>[]> {
    const payload = symbol ? { instId: this.transformSymbol(symbol) } : {};
    const data = await this.signAndRequest('/trade/orders-pending', 'GET', payload);
    return data.data;
  }

  /**
   * 获取账户余额
   */
  async getBalance(): Promise<Record<string, any>> {
    const data = await this.signAndRequest('/account/balance', 'GET', {});
    return data.data[0];
  }

  /**
   * 转换交易对符号 BTC/USDT -> BTC-USDT
   */
  private transformSymbol(symbol: string): string {
    return symbol.replace('/', '-');
  }

  /**
   * 签名请求
   */
  private async signAndRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    payload: Record<string, any>,
  ): Promise<any> {
    const timestamp = new Date().toISOString();
    const message =
      timestamp +
      method.toUpperCase() +
      endpoint +
      (method === 'GET'
        ? '?' + new URLSearchParams(payload).toString()
        : JSON.stringify(payload));

    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('base64');

    const headers = {
      'OK-ACCESS-KEY': this.apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': this.passphrase,
    };

    switch (method) {
      case 'GET':
        return this.get(endpoint, payload);
      case 'POST':
        return this.post(endpoint, payload);
      case 'DELETE':
        return this.delete(endpoint, payload);
      case 'PUT':
        return this.put(endpoint, payload);
    }
  }

  /**
   * 转换行情数据
   */
  private transformTicker(data: any): Ticker {
    return {
      symbol: data.instId.replace('-', '/'),
      lastPrice: parseFloat(data.last),
      priceChangePercent: parseFloat(data.sodUtc0 || '0') * 100,
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
    return {
      symbol,
      interval,
      openTime: parseInt(data[0]),
      open: parseFloat(data[1]),
      high: parseFloat(data[2]),
      low: parseFloat(data[3]),
      close: parseFloat(data[4]),
      volume: parseFloat(data[5]),
      closeTime: parseInt(data[0]) + 60000, // Simplified
      quoteAssetVolume: parseFloat(data[7]),
    };
  }
}
