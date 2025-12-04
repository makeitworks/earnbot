

export enum BinanceStreamType {
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export enum BinanceSpotWebsocketApiEnum {
  AGG_TRADE = '@aggTrade', // 归集交易
  TRADE = '@trade', // 逐笔交易

  // UTC K线
  KLINE_1M = '@kline_1m',   // 1分钟K线
  KLINE_3M = '@kline_3m',   // 3分钟K线
  KLINE_5M = '@kline_5m',   // 5分钟K线
  KLINE_15M = '@kline_15m',  // 15分钟K线
  KLINE_30M = '@kline_30m',  // 30分钟K线
  KLINE_1H = '@kline_1h',    // 1小时K线
  KLINE_2H = '@kline_2h',    // 2小时K线
  KLINE_4H = '@kline_4h',    // 4小时K线
  KLINE_6H = '@kline_6h',    // 6小时K线
  KLINE_8H = '@kline_8h',   // 8小时K线
  KLINE_12H = '@kline_12h',  // 12小时K线
  KLINE_1D = '@kline_1d',    // 1天K线
  KLINE_3D = '@kline_3d',    // 3天K线
  KLINE_1W = '@kline_1w',    // 1周K线
  KLINE_1MTH = '@kline_1M',  // 1月K线

  MINI_TICKER = '@miniTicker', // 逐秒刷新的24小时精简ticker信息
  ALL_MINI_TICKERS = '@miniTicker', // 全市场所有Symbol的精简Ticker

  TICKER = '@ticker', // 逐秒刷新的24小时完整ticker信息

  BOOK_TICKER = '@bookTicker', // 实时推送指定交易对最优挂单信息

  AVG_PRICE = '@avgPrice', // 平均价格流推送在固定时间间隔内的平均价格变动。

  // 有限档深度信息
  DEPTH_5_100MS = '@depth5@100ms', // 5档深度，100毫秒更新一次
  DEPTH_5_1000MS = '@depth5@1000ms', // 5档深度，1000毫秒更新一次
  DEPTH_10_100MS = '@depth10@100ms', // 10档深度，100毫秒更新一次
  DEPTH_10_1000MS = '@depth10@1000ms', // 10档深度，1000毫秒更新一次
  DEPTH_20_100MS = '@depth20@100ms', // 20档深度，100毫秒更新一次
  DEPTH_20_1000MS = '@depth20@1000ms', // 20档深度，1000毫秒更新一次
}