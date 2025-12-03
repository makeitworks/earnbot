/**
 * 交易所产品类型枚举
 */
export enum ProductType {
  /**
   * 现货交易
   */
  SPOT = 'SPOT',

  /**
   * USDT本位合约（永续和交割）
   * Binance: USDT Futures
   * OKX: Swap
   */
  USDT_FUTURES = 'USDT_FUTURES',

  /**
   * 币本位合约（永续和交割）
   * Binance: Coin Futures
   * OKX: Futures
   */
  COIN_FUTURES = 'COIN_FUTURES',
}
