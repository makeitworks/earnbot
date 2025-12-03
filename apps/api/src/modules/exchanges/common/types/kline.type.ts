/**
 * K线数据
 */
export interface Kline {
  /**
   * 交易对
   */
  symbol: string;

  /**
   * K线时间间隔 e.g. '1m', '5m', '1h', '1d'
   */
  interval: string;

  /**
   * K线开启时间 (毫秒时间戳)
   */
  openTime: number;

  /**
   * 开盘价
   */
  open: number;

  /**
   * 最高价
   */
  high: number;

  /**
   * 最低价
   */
  low: number;

  /**
   * 收盘价
   */
  close: number;

  /**
   * 交易量
   */
  volume: number;

  /**
   * K线关闭时间 (毫秒时间戳)
   */
  closeTime: number;

  /**
   * 交易额
   */
  quoteAssetVolume: number;

  /**
   * 成交笔数
   */
  numberOfTrades?: number;

  /**
   * 买方成交量
   */
  takerBuyBaseAssetVolume?: number;

  /**
   * 买方成交额
   */
  takerBuyQuoteAssetVolume?: number;
}
