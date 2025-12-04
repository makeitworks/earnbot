import { BaseRestClient } from '../../core/rest-client';
import { Ticker } from '../../common/types/ticker.type';
import { Kline } from '../../common/types/kline.type';
import * as crypto from 'crypto';
import { BinanceSpotRestApiEnum } from '../../common/enums/binance/spot-rest-api.enum';

/**
 * Binance Spot REST API 客户端
 * API Key 和 Secret 可选，仅在需要签名的请求时使用
 */
export class BinanceSpotRestClient extends BaseRestClient {
  constructor(apiKey?: string, apiSecret?: string) {
    super('https://api.binance.com', apiKey, apiSecret);
  }

  /**
   * 获取行情数据
   */
  async getTicker(symbol: string): Promise<Ticker> {
    const data = await this.get('/ticker/24hr', { symbol });
    return this.transformTicker(data);
  }

  /**
   * 批量获取行情数据
   */
  async getTickers(symbols?: string[]): Promise<Ticker[]> {
    const params = symbols ? { symbols: JSON.stringify(symbols) } : {};
    const data = await this.get('/ticker/24hr', params);
    const tickers = Array.isArray(data) ? data : [data];
    return tickers.map((t) => this.transformTicker(t));
  }

  /**
   * 获取K线数据
   */
  async getKlines(
    symbol: string,
    interval: string,
    limit: number = 500,
  ): Promise<Kline[]> {
    const data = await this.get('/klines', { symbol, interval, limit });
    return data.map((k: any) => this.transformKline(symbol, interval, k));
  }

  /**
   * 获取交易对信息
   */
  async getSymbolInfo(symbol: string): Promise<Record<string, any>> {
    const data = await this.get(BinanceSpotRestApiEnum.EXCHANGE_INFO, { symbol });
    return data.symbols?.[0] || null;
  }

  /**
   * 获取所有交易对信息
   */
  async getExchangeInfo(): Promise<Record<string, any>> {
    return this.get(BinanceSpotRestApiEnum.EXCHANGE_INFO);
  }

  /**
   * 下单（现货）
   */
  async placeOrder(order: Record<string, any>): Promise<Record<string, any>> {
    const payload = {
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity,
      ...(order.price && { price: order.price }),
      timestamp: Date.now(),
    };

    return this.signAndRequest('/order', 'POST', payload);
  }

  /**
   * 取消订单
   */
  async cancelOrder(symbol: string, orderId: string): Promise<Record<string, any>> {
    return this.signAndRequest('/order', 'DELETE', {
      symbol,
      orderId,
      timestamp: Date.now(),
    });
  }

  /**
   * 查询订单
   */
  async getOrder(symbol: string, orderId: string): Promise<Record<string, any>> {
    return this.signAndRequest('/order', 'GET', {
      symbol,
      orderId,
      timestamp: Date.now(),
    });
  }

  /**
   * 获取当前委托单
   */
  async getOpenOrders(symbol?: string): Promise<Record<string, any>[]> {
    const payload = { timestamp: Date.now() };
    if (symbol) {
      payload['symbol'] = symbol;
    }
    return this.signAndRequest('/openOrders', 'GET', payload);
  }

  /**
   * 获取账户余额
   */
  async getBalance(): Promise<Record<string, any>> {
    const data = await this.signAndRequest('/account', 'GET', {
      timestamp: Date.now(),
    });
    return data;
  }

  /**
   * 签名请求
   */
  private async signAndRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    payload: Record<string, any>,
  ): Promise<any> {
    const query = new URLSearchParams(payload).toString();
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(query)
      .digest('hex');

    const params = { ...payload, signature };

    switch (method) {
      case 'GET':
        return this.get(endpoint, params);
      case 'POST':
        return this.post(endpoint, {}, params);
      case 'DELETE':
        return this.delete(endpoint, params);
      case 'PUT':
        return this.put(endpoint, {}, params);
    }
  }

  /**
   * 转换行情数据
   */
  private transformTicker(data: any): Ticker {
    return {
      symbol: data.symbol,
      lastPrice: parseFloat(data.lastPrice),
      priceChangePercent: parseFloat(data.priceChangePercent),
      highPrice: parseFloat(data.highPrice),
      lowPrice: parseFloat(data.lowPrice),
      volume: parseFloat(data.volume),
      quoteAssetVolume: parseFloat(data.quoteAssetVolume),
      timestamp: data.closeTime,
      bidPrice: parseFloat(data.bidPrice),
      bidQty: parseFloat(data.bidQty),
      askPrice: parseFloat(data.askPrice),
      askQty: parseFloat(data.askQty),
    };
  }

  /**
   * 转换K线数据
   */
  private transformKline(symbol: string, interval: string, data: any): Kline {
    return {
      symbol,
      interval,
      openTime: data[0],
      open: parseFloat(data[1]),
      high: parseFloat(data[2]),
      low: parseFloat(data[3]),
      close: parseFloat(data[4]),
      volume: parseFloat(data[5]),
      closeTime: data[6],
      quoteAssetVolume: parseFloat(data[7]),
      numberOfTrades: data[8],
      takerBuyBaseAssetVolume: parseFloat(data[9]),
      takerBuyQuoteAssetVolume: parseFloat(data[10]),
    };
  }
}
