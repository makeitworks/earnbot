
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

// 生效时间,订单在失效前的有效时间
export enum TimeInForce {
    GTC = 'GTC', // 成交为止,订单会一直有效，直到被成交或者取消。
    IOC = 'IOC', // 无法立即成交的部分就撤销,订单在失效前会尽量多的成交
    FOK = 'FOK', // 无法全部立即成交就撤销,如果无法全部成交，订单会失效。
}

export enum SpotRestApi {
    EXCHANGE_INFO = '/api/v3/exchangeInfo' // 交易规范信息
}