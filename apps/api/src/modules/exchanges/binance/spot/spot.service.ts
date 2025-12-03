import { Injectable } from '@nestjs/common';
import { IProduct } from '../../common/interfaces/product.interface';
import { ProductType } from '../../common/enums/product-type.enum';
import { Order, OrderRequest } from '../../common/types/order.type';
import { Ticker } from '../../common/types/ticker.type';
import { Kline } from '../../common/types/kline.type';
import { BinanceSpotRestClient } from './rest.client';
import { BinanceMarketWebsocketClient } from './market-websocket.client';

/**
 * Binance 现货产品服务
 * API 凭证可选，用户可以获取公开市场数据而不需要凭证
 */
@Injectable()
export class BinanceSpotService implements IProduct {
  readonly productType = 'SPOT';
  private restClient: BinanceSpotRestClient;
  private wsClient: BinanceMarketWebsocketClient;

  constructor(apiKey?: string, apiSecret?: string) {
    this.restClient = new BinanceSpotRestClient(apiKey, apiSecret);
    this.wsClient = new BinanceMarketWebsocketClient(apiKey, apiSecret);
  }

  /**
   * 获取行情数据
   */
  async getTicker(symbol: string): Promise<Ticker> {
    return this.restClient.getTicker(symbol);
  }

  /**
   * 批量获取行情数据
   */
  async getTickers(symbols?: string[]): Promise<Ticker[]> {
    return this.restClient.getTickers(symbols);
  }

  /**
   * 获取K线数据
   */
  async getKlines(
    symbol: string,
    interval: string,
    limit?: number,
  ): Promise<Kline[]> {
    return this.restClient.getKlines(symbol, interval, limit);
  }

  /**
   * 获取交易对信息
   */
  async getSymbolInfo(symbol: string): Promise<Record<string, any>> {
    return this.restClient.getSymbolInfo(symbol);
  }

  /**
   * 获取所有交易对信息
   */
  async getExchangeInfo(): Promise<Record<string, any>> {
    return this.restClient.getExchangeInfo();
  }

  /**
   * 下单
   */
  async placeOrder(order: OrderRequest): Promise<Order> {
    const result = await this.restClient.placeOrder(order as any);
    return this.transformOrder(result);
  }

  /**
   * 取消订单
   */
  async cancelOrder(symbol: string, orderId: string): Promise<Order> {
    const result = await this.restClient.cancelOrder(symbol, orderId);
    return this.transformOrder(result);
  }

  /**
   * 查询订单
   */
  async getOrder(symbol: string, orderId: string): Promise<Order> {
    const result = await this.restClient.getOrder(symbol, orderId);
    return this.transformOrder(result);
  }

  /**
   * 查询当前委托单
   */
  async getOpenOrders(symbol?: string): Promise<Order[]> {
    const results = await this.restClient.getOpenOrders(symbol);
    return results.map((r) => this.transformOrder(r));
  }

  /**
   * 查询历史订单
   */
  async getHistoryOrders(symbol: string, limit?: number): Promise<Order[]> {
    // TODO: 实现历史订单查询
    throw new Error('Method not implemented');
  }

  /**
   * 获取账户余额
   */
  async getBalance(): Promise<Record<string, any>> {
    const data = await this.restClient.getBalance();
    return this.transformBalance(data);
  }

  /**
   * WebSocket 订阅行情
   */
  async subscribeTicker(
    symbols: string[],
    callback: (ticker: Ticker) => void,
  ): Promise<void> {
    return this.wsClient.subscribeTicker(symbols, callback);
  }

  /**
   * WebSocket 订阅K线
   */
  async subscribeKline(
    symbols: string[],
    interval: string,
    callback: (kline: Kline) => void,
  ): Promise<void> {
    return this.wsClient.subscribeKline(symbols, interval, callback);
  }

  /**
   * WebSocket 订阅订单更新
   */
  async subscribeOrders(callback: (order: Order) => void): Promise<void> {
    // TODO: 实现订单更新订阅
    throw new Error('Method not implemented');
  }

  /**
   * 断开所有WebSocket连接
   */
  async disconnectAll(): Promise<void> {
    await this.wsClient.disconnect();
  }

  /**
   * 转换订单数据
   */
  private transformOrder(data: any): Order {
    return {
      orderId: data.orderId?.toString(),
      symbol: data.symbol,
      side: data.side,
      type: data.type,
      quantity: parseFloat(data.origQty),
      price: parseFloat(data.price),
      status: data.status,
      executedQty: parseFloat(data.executedQty),
      cummulativeQuoteQty: parseFloat(data.cummulativeQuoteQty),
      avgPrice: parseFloat(data.cummulativeQuoteQty) / parseFloat(data.executedQty) || 0,
      createdAt: data.time,
      updatedAt: data.updateTime,
    };
  }

  /**
   * 转换账户余额
   */
  private transformBalance(data: any): Record<string, any> {
    const balances: Record<string, any> = {};
    if (Array.isArray(data.balances)) {
      data.balances.forEach((b: any) => {
        balances[b.asset] = {
          free: parseFloat(b.free),
          locked: parseFloat(b.locked),
        };
      });
    }
    return balances;
  }
}
