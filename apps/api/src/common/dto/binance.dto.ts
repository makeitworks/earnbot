import { ContractStatus, ContractType, OrderType, TimeInForce, TradeStatus } from "../enums/binance.enums";

export interface BinanceSpotSymbolInfo {
  symbol: string;
  status: TradeStatus;
  baseAsset: string;
  baseAssePrecision: number;
  quoteAsset: string;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: OrderType[]
}


export interface BinanceCMFSymbolInfo {
  symbol: string;  // 交易对
  pair: string; // 标的交易对
  contractType: ContractType; // 合约类型
  orderTypes: OrderType[];
  deliveryDate: number; // 
  onboardDate: number; //
  contractStatus: ContractStatus, //
  contractSize: number; //
  quoteAsset: string;  // 报价币种
  baseAsset: string; // 标的物
  marginAsset: string; // 保证金币种
  pricePrecision: number; // 价格小数点位数(仅作为系统精度使用，注意同tickSize 区分)
  quantityPrecision: number; // 数量小数点位数(仅作为系统精度使用，注意同stepSize 区分)
  baseAssetPrecision: number;
  quotePrecision: number;
  triggerProtect: string;
  underlyingType: string; // 标的类型
  timeInForce: TimeInForce[]; // 有效方式
}



// {
//     "e": "bookTicker",
//     "u": 1550109917123,
//     "s": "ETHUSD_PERP",
//     "b": "3115.13",
//     "B": "2916",
//     "a": "3115.14",
//     "A": "1",
//     "T": 1765264074728,
//     "E": 1765264074730,
//     "ps": "ETHUSD"
// }
export interface BinanceCMFBookTicker {
  e: string;  // 事件类型
  u: number;  // 更新ID
  s: string;  // 交易对
  b: string;  // 买单最优挂单价格
  B: string;  // 买单最优挂单数量
  a: string;  // 卖单最优挂单价格
  A: string;  // 卖单最优挂单数量
  T: number;  // 撮合时间
  E: number;  // 事件时间
  ps: string; // 标的交易对
}

export interface BinanceSpotBookTicker {
  u: number; // 更新ID
  s: string; // 交易对
  b: string; // 买单最优挂单价格
  B: string; // 买单最优挂单数量
  a: string; // 卖单最优挂单价格
  A: string; // 卖单最优挂单数量
}

export interface BinanceCMFMiniTicker {
  e: string; // 事件类型
  E: number; // 事件时间
  s: string; // 交易对
  ps: string; // 标的交易对
  c: string; // 最新成交价格
  o: string; // 24小时钱开始第一笔成交价格
  h: string; // 24小时内最高成交价
  l: string; // 24小时内最低成交价
  v: string; // 24小时成交量
  q: string; // 24小时成交额
}

// {
//   "e":"depthUpdate",		// 事件类型
//   "E":1591269996801,		// 事件时间
//   "T":1591269996646,		// 撮合时间
//   "s":"BTCUSD_200626",		// 交易对
//   "ps":"BTCUSD",			// 标的交易对
//   "U":17276694,
//   "u":17276701,
//   "pu":17276678,
//   "b":[						// 买方
//     [
//       "9523.0",				// 价格
//       "5"					// 数量
//     ],
//     [
//       "9522.8",
//       "8"
//     ],
//     [
//       "9522.6",
//       "2"
//     ],
//     [
//       "9522.4",
//       "1"
//     ],
//     [
//       "9522.0",
//       "5"
//     ]
//   ],
//   "a":[						// 卖方
//     [
//       "9524.6",				// 价格
//       "2"					// 数量
//     ],
//     [
//       "9524.7",
//       "3"
//     ],
//     [
//       "9524.9",
//       "16"
//     ],
//     [
//       "9525.1",
//       "10"
//     ],
//     [
//       "9525.3",
//       "6"
//     ]
//   ]
// }
export interface BinanceCMFDepth {
  e: string; // 时间类型
  E: number; // 事件事件
  T: number; // 撮合时间
  s: string; // 交易对
  ps: string; // 标的交易对
  U: number; // 
  u: number; //
  pu: number;
  b: [string, string][]; // 买方
  a: [string, string][]; // 卖方
}


// "e": "24hrMiniTicker",  // 事件类型
// "E": 1672515782136,     // 事件时间
// "s": "BNBBTC",          // 交易对
// "c": "0.0025",          // 最新成交价格
// "o": "0.0010",          // 24小时前开始第一笔成交价格
// "h": "0.0025",          // 24小时内最高成交价
// "l": "0.0010",          // 24小时内最低成交加
// "v": "10000",           // 成交量
// "q": "18"               // 成交额
export interface BinanceSpotMiniTicker {
  e: string; // 事件类型
  E: number; // 事件时间
  s: string; // 交易对
  c: string; // 最新成交价
  o: string; // 24小时前开始第一笔成交价格
  h: string; // 24小时内最高成交价
  l: string; // 24小时内最低成交加
  v: string; // 成交量
  q: string; // 成交额 
}


// {
//   "lastUpdateId": 160,  // 末次更新ID
//   "bids": [             // 买单
//     [
//       "0.0024",         // 价
//       "10",             // 量
//       []                // 忽略
//     ]
//   ],
//   "asks": [             // 卖单
//     [
//       "0.0026",         // 价
//       "100",            // 量
//       []                // 忽略
//     ]
//   ]
// }

export interface BinanceSpotDepth {

}