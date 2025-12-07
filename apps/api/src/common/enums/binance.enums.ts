
// 交易对的状态
export enum TradeStatus {
    TRADING = 'TRADING',    // 交易中
    END_OF_DAY = 'END_OF_DAY',   // 收盘
    HALT = 'HALT', // 交易终止(交易对已下线)
    BREAK = 'BREAK', // 交易暂停
}

// 订单状态
export enum OrderStatus {
    NEW = 'NEW', // 该订单被交易引擎接受
    PENDING_NEW = 'PENDING_NEW', // 该订单处于待处理 (PENDING) 阶段，直到其所属订单组（order list） 中的 working order 完全成交
    PARTIALLY_FILLED = 'PARTIALLY_FILLED',  // 部分订单已被成交
    FILLED = 'FILLED',  // 订单已完全成交
    CANCELED = 'CANCELED', // 用户撤销了订单
    PENDING_CANCEL = 'PENDING_CANCEL', // 撤销中(目前并未使用)
    REJECTED = 'REJECTED', // 订单没有被交易引擎接受，也没被处理
    EXPIRED = 'EXPIRED', //  该订单根据订单类型的规则被取消（例如，没有成交的 LIMIT FOK 订单, LIMIT IOC 或部分成交的 MARKET 订单）
    EXPIRED_IN_MATCH = 'EXPIRED_IN_MATCH',  // 表示订单由于 STP 而过期。（例如，带有 EXPIRE_TAKER 的订单与账簿上同属相同帐户或相同 tradeGroupId 的现有订单匹配）
}

// 订单类型
export enum OrderType {
    LIMIT = 'LIMIT',  // 限价单
    MARKET = 'MARKET', //  市价单
    STOP_LOSS = 'STOP_LOSS', // 止损单
    STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT', // 限价止损单
    TAKE_PROFIT = 'TAKE_PROFIT', // 止盈单
    TAKE_PROFIT_LIMIT  = 'TAKE_PROFIT_LIMIT', // 限价止盈单
    LIMIT_MAKER = 'LIMIT_MAKER' // 限价做市单
}

// 合约类型
export enum ContractType {
    PERPETUAL = 'PERPETUAL', // 永续合约
    CURRENT_QUARTER = 'CURRENT_QUARTER', //当季合约
    NEXT_QUARTER = 'NEXT_QUARTER', // 次季合约
}

// 合约状态
export enum ContractStatus {
    PENDING_TRADING = 'PENDING_TRADING', //待上市
    TRADING = 'TRADING', //交易中
    PRE_DELIVERING = 'PRE_DELIVERING', // 预结算
    DELIVERING = 'DELIVERING', // 交割中
    DELIVERED = 'DELIVERED', // 已交割
}


// 订单返回类型
export enum NewOrderRespType {
    ACK = 'ACK',
    RESULT = 'RESULT',
    FULL = 'FULL'
}

// 订单方向
export enum OrderSide {
    BUY = 'BUY',    // 买入
    SELL = 'SELL',  // 卖出
}

export enum PositionSide {
    BOTH = 'BOTH', // 单一持仓方向
    LONG = 'LONG',  // 多头(双向持仓下)
    SHORT = 'SHORT', // 空头(双向持仓下)
}

// 生效时间,订单在失效前的有效时间
export enum TimeInForce {
    GTC = 'GTC', // 成交为止,订单会一直有效，直到被成交或者取消。
    IOC = 'IOC', // 无法立即成交的部分就撤销,订单在失效前会尽量多的成交
    FOK = 'FOK', // 无法全部立即成交就撤销,如果无法全部成交，订单会失效
    GTX = 'GTX', // 无法成为挂单方就撤销
}

// 现货REST API
export enum SpotRestApi {
    EXCHANGE_INFO = '/api/v3/exchangeInfo' // 交易规范信息
}

// 现货WS API
export const SpotWsApi = {
  // 归集交易
  AGG_TRADE : {
    NAME: 'aggTrade',
    ENDPOINT: 'aggTrade'
  },
  // 逐笔交易
  TRADE : {
    NAME: 'trade',
    ENDPOINT: 'trade'
  },
  KLINE: {
    NAME: 'kline',
    ENDPOINT: 'kline', 
  },
  MINI_TICKER: {
    NAME: '24hrMiniTicker',
    ENDPOINT: 'miniTicker'
  },
  MINI_ALL_TICKER: {
    NAME: '24hrMiniTicker',
    ENDPOINT: '!miniTicker@arr'
  },
  TICKER: {
    NAME: '24hrTicker',
    ENDPOINT: 'ticker'
  },
  BOOK_TICKER: {
    NAME: 'bookTicker',
    ENDPOINT: 'bookTicker'
  },
  AVG_PRICE: {
    NAME: 'avgPrice',
    ENDPOINT: 'avgPrice'
  },
  DEPTH: {
    NAME: 'depth',
    ENDPOINT: 'depth'
  },
}

export enum Level  {
  LEVEL_5 = '5',
  LEVEL_10 = '10',
  LEVEL_20 = '20'
}

export enum Interval {
  I_100ms = '100ms',
  I_1000ms = '1000ms',
  I_1m = '1m',
  I_3m = '3m',
  I_5m = '5m',
  I_15m = '15m',
  I_30m = '30m',
  I_1h = '1h',
  I_2h = '2h',
  I_4h = '4h',
  I_6h = '6h',
  I_8h = '8h',
  I_12h = '12h',
  I_1d = '1d',
  I_3d = '3d',
  I_1w = '1w',
  I_1M = '1M',
}

// 币本位合约REST API
export enum CMFRestApi {
    EXCHANGE_INFO = '/dapi/v1/exchangeInfo', // 获取交易规则和交易对
}