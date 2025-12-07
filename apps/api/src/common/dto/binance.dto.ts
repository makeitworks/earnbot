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
  orderType: OrderType;
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