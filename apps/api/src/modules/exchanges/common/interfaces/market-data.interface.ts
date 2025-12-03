import { Ticker } from '../types/ticker.type';
import { Kline } from '../types/kline.type';

/**
 * 市场数据接口
 * 定义所有交易所市场数据相关的统一操作
 */
export interface IMarketData {
  /**
   * 获取行情数据
   */
  getTicker(symbol: string): Promise<Ticker>;

  /**
   * 批量获取行情数据
   */
  getTickers(symbols?: string[]): Promise<Ticker[]>;

  /**
   * 获取K线数据
   * @param symbol 交易对
   * @param interval K线周期
   * @param limit 返回记录数
   */
  getKlines(
    symbol: string,
    interval: string,
    limit?: number,
  ): Promise<Kline[]>;

  /**
   * 获取交易对信息
   */
  getSymbolInfo(symbol: string): Promise<Record<string, any>>;

  /**
   * 获取所有交易对信息
   */
  getExchangeInfo(): Promise<Record<string, any>>;
}
