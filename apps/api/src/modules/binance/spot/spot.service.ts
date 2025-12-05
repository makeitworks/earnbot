import { Injectable, Logger } from '@nestjs/common';
import { BinanceSpotRestClient } from './spot.rest.client';
import { BinanceSpotMarketWsClient } from './market.ws.client';

import { OrderType, SpotRestApi, TradeStatus } from '../../../common/enums/binance.enums';

import { Cron, CronExpression } from '@nestjs/schedule';
import { BinanceSpotSymbolInfo } from '../dto/spot.dtos';

@Injectable()
export class BinanceSpotService {
  constructor(
    private readonly restClient: BinanceSpotRestClient,
    private readonly marketWsClient: BinanceSpotMarketWsClient,
  ) {}

  private readonly logger = new Logger(BinanceSpotService.name);

  /**
   * 枚5分钟刷新基差套利交易对
   */
  // @Cron(CronExpression.EVERY_5_MINUTES)
  // async freshBasisArbitragePair() {
  //   // 获取所有交易对
  //   let allTradingPairs = await this.getExchangeInfo()

  // }


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
  async getAllPairs(): Promise<BinanceSpotSymbolInfo[]> {
    let exchangeInfo = await this.restClient.get(SpotRestApi.EXCHANGE_INFO, {
      showPermissionSets: false,
    });
    return exchangeInfo.symbols.map( symbol => this.transformSpotSymbolInfo(symbol) );
  }

  
}
