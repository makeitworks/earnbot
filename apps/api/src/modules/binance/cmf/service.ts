import { Injectable, Logger } from '@nestjs/common';
import { BinanceCMFRestClient } from './rest.client';
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

  public initalize(onOpen: ()=> void, onClose: ()=>void) {
    this.marketWsClient.initialize(onOpen, onClose);
  }

  /**
   * 获取所有交易对信息
   */
  async getExchangeInfo(): Promise<BinanceCMFSymbolInfo[]> {
    let resp = await this.restClient.get(BinanceEnums.CMFRestApi.EXCHANGE_INFO)
    return resp.symbols.map( (symbol: any) => this.transformCMFSymbolInfo(symbol));
  }

  private transformCMFSymbolInfo(s: Record<string, any>): BinanceCMFSymbolInfo {
    let d: BinanceCMFSymbolInfo = {
      symbol: s.symbol,
      pair: s.pair,
      contractType: s.contractType as BinanceEnums.ContractType,
      orderTypes: s.orderTypes as BinanceEnums.OrderType[],
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

  // ---------------------- 订阅信息流
  /**
   * 订阅归集交易数据
   */
  subscribeAggTrade(symbols: string[], callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    payload.params = symbols.map( symbol => `${symbol.toLowerCase()}@${BinanceEnums.CMFWsApi.AGG_TRADE.ENDPOINT}` );
    this.marketWsClient.subscribe(BinanceEnums.CMFWsApi.AGG_TRADE.NAME, payload, callback);
  }

  /**
   * 订阅最新现货价格指数
   */
  subscribeIndexPrice(pairs: string[], interval: BinanceEnums.Interval, callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    payload.params = pairs.map( pair => {
      let param = `${pair.toLowerCase()}@${BinanceEnums.CMFWsApi.INDEX_PRICE.ENDPOINT}`
      if (interval == BinanceEnums.Interval.I_1s) {
        param += `@${BinanceEnums.Interval.I_1s}`
      }
      return param;
    });

    this.marketWsClient.subscribe(BinanceEnums.CMFWsApi.INDEX_PRICE.NAME, payload, callback);
  }

  /**
   * 订阅MarkPrice
   */
  subscribeMarkPrice(symbols: string[], interval: BinanceEnums.Interval, callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    payload.params = symbols.map( symbol => {
      let param = `${symbol.toLowerCase()}@${BinanceEnums.CMFWsApi.MARK_PRICE.ENDPOINT}`
      if(interval == BinanceEnums.Interval.I_1s) {
        param += `@${BinanceEnums.Interval.I_1s}`
      }
      return param;
    });

    this.marketWsClient.subscribe(BinanceEnums.CMFWsApi.MARK_PRICE.NAME, payload, callback);
  }

  /**
   * 订阅K线数据
   */
  subscribeKline(symbols: string[], interval: BinanceEnums.Interval, callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    payload.params = symbols.map( symbol => `${symbol.toLowerCase()}@${BinanceEnums.CMFWsApi.KLINE.ENDPOINT}_${interval}`);
    this.marketWsClient.subscribe(BinanceEnums.CMFWsApi.KLINE.NAME, payload, callback);
  }

  /**
   * 订阅深度信息
   */
  subscribeDepth(symbols: string[], level: BinanceEnums.Level, interval: BinanceEnums.Interval, callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    payload.params = symbols.map( symbol => `${symbol.toLowerCase()}@${BinanceEnums.CMFWsApi.DEPTH.ENDPOINT}${level}@${interval}`);
    this.marketWsClient.subscribe(BinanceEnums.CMFWsApi.DEPTH.NAME, payload, callback);
  }

  /**
   * 订阅symbol的最优挂单信息
   */
  subscribeBookTicker(symbols: string[], callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    payload.params = symbols.map( symbol => `${symbol.toLowerCase()}@${BinanceEnums.CMFWsApi.BOOK_TICKER.ENDPOINT}`);
    this.marketWsClient.subscribe(BinanceEnums.CMFWsApi.BOOK_TICKER.NAME, payload, callback);
  }

  /**
   * 订阅全市场最优挂单信息
   */
  subscribeFullBookTicker(callback: (data: any) => void) {
    let payload: Record<string, any> = { 
      params: [`${BinanceEnums.CMFWsApi.FULL_BOOK_TICKER.ENDPOINT}`]
    }
    this.marketWsClient.subscribe(BinanceEnums.CMFWsApi.FULL_BOOK_TICKER.NAME, payload, callback);
  }

  /**
   * 订阅精简Ticker
   */
  subscribeMiniTicker(symbols: string[], callback:(data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    if(symbols.length <= 0) {
      payload.params = [ `!${BinanceEnums.CMFWsApi.MINI_TICKER}@arr` ];
    } else {
      payload.params = symbols.map( symbol => `${symbol.toLowerCase()}@${BinanceEnums.CMFWsApi.MINI_TICKER}`)
    }
    this.marketWsClient.subscribe(BinanceEnums.CMFWsApi.MINI_TICKER.NAME, payload, callback);
  }

}
