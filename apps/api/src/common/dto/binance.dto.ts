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