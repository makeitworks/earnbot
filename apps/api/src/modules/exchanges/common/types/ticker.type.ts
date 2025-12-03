/**
 * 行情数据（Ticker）
 */
export interface Ticker {
  /**
   * 交易对 e.g. BTC/USDT
   */
  symbol: string;

  /**
   * 最后成交价格
   */
  lastPrice: number;

  /**
   * 24小时变化百分比
   */
  priceChangePercent: number;

  /**
   * 24小时最高价
   */
  highPrice: number;

  /**
   * 24小时最低价
   */
  lowPrice: number;

  /**
   * 24小时成交量
   */
  volume: number;

  /**
   * 24小时成交额 (用基准货币表示)
   */
  quoteAssetVolume: number;

  /**
   * 时间戳
   */
  timestamp: number;

  /**
   * 买一价
   */
  bidPrice?: number;

  /**
   * 买一量
   */
  bidQty?: number;

  /**
   * 卖一价
   */
  askPrice?: number;

  /**
   * 卖一量
   */
  askQty?: number;
}
