import { DepthLevelEnum, DepthUpdateSpeedEnum, KlineIntervalEnum } from '../enums/binance/spot-websocket-api.enum';
import { Order, OrderRequest } from '../types/order.type';
import { IMarketData } from './market-data.interface';

/**
 * 产品接口
 * 定义各产品类型（现货、合约等）的统一操作接口
 */
export interface IProduct extends IMarketData {
  /**
   * 产品名称 e.g. 'spot', 'usdt-futures', 'coin-futures'
   */
  readonly productType: string;

  /**
   * 下单
   */
  placeOrder(order: OrderRequest): Promise<Order>;

  /**
   * 取消订单
   */
  cancelOrder(symbol: string, orderId: string): Promise<Order>;

  /**
   * 查询订单
   */
  getOrder(symbol: string, orderId: string): Promise<Order>;

  /**
   * 查询当前委托单
   */
  getOpenOrders(symbol?: string): Promise<Order[]>;

  /**
   * 查询历史订单
   */
  getHistoryOrders(symbol: string, limit?: number): Promise<Order[]>;

  /**
   * 获取账户余额
   */
  getBalance(): Promise<Record<string, any>>;

  /**
   * WebSocket 订阅行情
   */
  subscribeTicker(symbols: string[], callback: (ticker: any) => void): Promise<void>;


  /**
   * WebSocket 订阅成交
   */
  subscribeTrade(symbols: string[], calllback: (trade: any) => void): Promise<void>;

  /**
   * WebSocket 订阅K线
   */
  subscribeKline(symbols: string[], interval: KlineIntervalEnum, callback: (kline: any) => void): Promise<void>;

  /**
   * WebSocket 订阅均价
   */
  subscribeAvgPrice(symbols: string[], callback: (data: any) => void): Promise<void>;

  /**
   * WebSocket 订阅深度 
   */
  subscribeDepth(symbols: string[], level: DepthLevelEnum, speed: DepthUpdateSpeedEnum, callback: (data: any) => void): Promise<void>;

  /**
   * WebSocket 订阅订单更新
   */
  subscribeOrders(callback: (order: any) => void): Promise<void>;

  /**
   * 断开所有WebSocket连接
   */
  disconnectAll(): Promise<void>;
}
