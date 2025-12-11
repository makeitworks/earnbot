import { Injectable, Logger } from '@nestjs/common';
import { BinanceCMFRestClient } from './cmf.rest.client';
import { BinanceCMFMarketWsClient } from './market.ws.client';
import { BinanceCMFSymbolInfo } from '../../../common/dto/binance.dto';
import * as BinanceEnums from '../../../common/enums/binance.enums'

@Injectable()
export class BinanceCMFService {

  private readonly logger = new Logger(BinanceCMFService.name)

  constructor(
    private readonly restClient: BinanceCMFRestClient,
    private readonly marketWsClient: BinanceCMFMarketWsClient,
  ) { }

  /**
   * 获取所有交易对信息
   */
  async getExchangeInfo(): Promise<BinanceCMFSymbolInfo[]> {
    let resp = await this.restClient.get(BinanceEnums.CMFRestApi.EXCHANGE_INFO)
    return resp.symbols.map(symbol => this.transformCMFSymbolInfo(symbol));
  }

  private transformCMFSymbolInfo(s: Record<string, any>): BinanceCMFSymbolInfo {
    let d: BinanceCMFSymbolInfo = {
      symbol: s.symbol,
      pair: s.pair,
      contractType: s.contractType as BinanceEnums.ContractType,
      orderType: s.orderType as BinanceEnums.OrderType,
      deliveryDate: s.deliveryDate,
      onboardDate: s.onboardDate,
      contractStatus: s.contractStatus as BinanceEnums.ContractStatus,
      contractSize: s.contractSize,
      quoteAsset: s.quoteAsset,
      baseAsset: s.baseAsset,
      marginAsset: s.marginAsset,
      pricePrecision: s.pricePrecision,
      quantityPrecision: s.quantityPrecision,
      baseAssetPrecision: s.baseAssetPrecision,
      quotePrecision: s.quotePrecision,
      triggerProtect: s.triggerProtect,
      underlyingType: s.underlyingType,
      timeInForce: s.timeInForce as BinanceEnums.TimeInForce[]
    }
    return d;
  }

  /**
   * 注册websocket 打开与关闭事件回调
   */
  public registerMarketOpenCloseCallbacks(onOpen: () => void, onClose: () => void) {
    this.marketWsClient.registerOpenCloseCallbacks(onOpen, onClose);
  }
}
