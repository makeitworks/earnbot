import { OrderType, TradeStatus } from "../../../common/enums/binance.enums";

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