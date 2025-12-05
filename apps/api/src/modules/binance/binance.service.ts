import { Injectable, Logger } from '@nestjs/common';
import { BinanceSpotRestClient } from './spot/rest.client';
import { BinanceSpotMarketWsClient } from './spot/market-ws.client';

import { SpotRestApi } from '../../common/enums/binance.enums';
import { ExchangeInfoDto } from './dto/exchangeinfo.dto';
import { SymbolInfoDto } from './dto/symbolinfo.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BinanceService {
  constructor(
    private readonly restClient: BinanceSpotRestClient,
    private readonly marketWsClient: BinanceSpotMarketWsClient,
  ) {}

  private readonly logger = new Logger(BinanceService.name);

  /**
   * 更新关注交易对
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateWatchingPair() {
    let exchangeInfo = await this.getExchangeInfo();


  }

  private transformExchangeInfo(data: Record<string, any>): ExchangeInfoDto {
    let result = new ExchangeInfoDto();
    result.timezone = data.timezone;
    result.serverTime = data.serverTime;
    result.symbols = [];

    data.symbols.forEach((s) => {
      let d = new SymbolInfoDto();
      d.symbol = s.symbol;
      d.status = s.status;
      d.baseAsset = s.baseAsset;
      d.baseAssePrecision = s.baseAssePrecision;
      d.quoteAsset = s.quoteAsset;
      d.quoteAssetPrecision = s.quoteAssetPrecision;
      d.baseCommissionPrecision = s.baseCommissionPrecision;
      d.quoteCommissionPrecision = s.quoteCommissionPrecision;
      d.orderTypes = s.orderTypes;

      result.symbols.push(d);
    });
    return result;
  }

  /**
   * 获取所有交易对信息
   */
  async getExchangeInfo(): Promise<ExchangeInfoDto> {
    let data = await this.restClient.get(SpotRestApi.EXCHANGE_INFO, {
      showPermissionSets: false,
    });
    return this.transformExchangeInfo(data);
  }

  
}
