import { Injectable } from '@nestjs/common';
import { BinanceSpotRestClient } from './spot/rest.client';
import { BinanceSpotMarketWsClient } from './spot/market-ws.client';

import { SpotRestApi } from '../../common/enums/binance.enums';
import { ExchangeInfoDto } from './dto/exchangeinfo.dto';
import { SymbolInfoDto } from './dto/symbolinfo.dto';

@Injectable()
export class BinanceService {
  constructor(
    private readonly restClient: BinanceSpotRestClient,
    private readonly marketWsClient: BinanceSpotMarketWsClient,
  ) {}

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
