import { Injectable, Logger } from '@nestjs/common';
import { BinanceSpotRestClient } from './spot.rest.client';
import { BinanceSpotMarketWsClient } from './market.ws.client';

import { OrderType, SpotRestApi, TradeStatus } from '../../../common/enums/binance.enums';

import { BinanceSpotSymbolInfo } from '../dto/spot.dtos';

@Injectable()
export class BinanceSpotService {
  constructor(
    private readonly restClient: BinanceSpotRestClient,
    private readonly marketWsClient: BinanceSpotMarketWsClient
  ) { }

  private readonly logger = new Logger(BinanceSpotService.name);

  private transformSpotSymbolInfo(s: Record<string, any>): BinanceSpotSymbolInfo {
    let d: BinanceSpotSymbolInfo = {
      symbol: s.symbol,
      status: s.status as TradeStatus,
      baseAsset: s.baseAsset,
      baseAssePrecision: s.baseAssePrecision,
      quoteAsset: s.quoteAsset,
      quoteAssetPrecision: s.quoteAssetPrecision,
      baseCommissionPrecision: s.baseCommissionPrecision,
      quoteCommissionPrecision: s.quoteCommissionPrecision,
      orderTypes: s.orderTypes as OrderType[]
    }
    return d;
  }

  /**
   * 获取所有交易对信息
   */
  async getPairsFromEx(symbols?: string[]): Promise<BinanceSpotSymbolInfo[]> {
    let params: any = {
      showPermissionSets: false,
    }
    if (symbols && symbols.length > 0) {
      params.symbols = [];
      symbols.forEach(symbol => params.push(symbol))
    }

    let exchangeInfo = await this.restClient.get(SpotRestApi.EXCHANGE_INFO, params);
    return exchangeInfo.symbols.map(symbol => this.transformSpotSymbolInfo(symbol))
  }


}
