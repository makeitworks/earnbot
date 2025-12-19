import { Injectable, Logger } from '@nestjs/common';
import { BinanceSpotRestClient } from './rest.client';
import { BinanceSpotMarketWsClient } from './market.ws.client';

import * as BinanceEnums from '../../../common/enums/binance.enums';

import { BinanceSpotSymbolInfo } from '../../../common/dto/binance.dto';

@Injectable()
export class BinanceSpotService {

  private readonly logger = new Logger(BinanceSpotService.name);

  constructor(
    private readonly restClient: BinanceSpotRestClient,
    private readonly marketWsClient: BinanceSpotMarketWsClient
  ) { }


  public initialize(onOpen: ()=>void, onClose: ()=> void) {
    this.marketWsClient.initialize(onOpen, onClose);
  }

   /**
   * 获取所有交易对信息
   */
  async getExchangeInfo(): Promise<BinanceSpotSymbolInfo[]> {
    let params: Record<string, any> = {
      showPermissionSets: false,
    }
    let exchangeInfo = await this.restClient.get(BinanceEnums.SpotRestApi.EXCHANGE_INFO, params);
    return exchangeInfo.symbols.map( (symbol: any) => this.transformSpotSymbolInfo(symbol))
  }

  private transformSpotSymbolInfo(s: Record<string, any>): BinanceSpotSymbolInfo {
    let d: BinanceSpotSymbolInfo = {
      symbol: s.symbol,
      status: s.status as BinanceEnums.TradeStatus,
      baseAsset: s.baseAsset,
      baseAssePrecision: s.baseAssePrecision,
      quoteAsset: s.quoteAsset,
      quoteAssetPrecision: s.quoteAssetPrecision,
      baseCommissionPrecision: s.baseCommissionPrecision,
      quoteCommissionPrecision: s.quoteCommissionPrecision,
      orderTypes: s.orderTypes as BinanceEnums.OrderType[]
    }
    return d;
  }

  // ---------------------- 订阅信息流
  /**
   * 订阅归集交易数据(归集交易与逐笔交易的区别在于，同一个taker在同一价格与多个maker成交时，会被归集为一笔成交)
   */
  subscribeAggTrade(symbols: string[], callback: (data: any) => void) {
    let payload: Record<string, any> = {
      params: []
    }
    payload.params = symbols.map(symbol => `${symbol.toLowerCase()}@${BinanceEnums.SpotWsApi.AGG_TRADE.ENDPOINT}`)

    this.marketWsClient.subscribe(BinanceEnums.SpotWsApi.AGG_TRADE.NAME, payload, callback)
  }

  /**
   * 订阅逐笔交易数据 
   */
  subscribeTrade(symbols: string[], callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };

    payload.params = symbols.map(symbol => `${symbol.toLowerCase()}@${BinanceEnums.SpotWsApi.TRADE.ENDPOINT}`)

    this.marketWsClient.subscribe(BinanceEnums.SpotWsApi.TRADE.NAME, payload, callback);
  }

  /**
   * 订阅平均价格数据
   */
  subscribeAvgPrice(symbols: string[], callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    payload.params = symbols.map(symbol => `${symbol.toLowerCase()}@${BinanceEnums.SpotWsApi.AVG_PRICE.ENDPOINT}`)

    this.marketWsClient.subscribe(BinanceEnums.SpotWsApi.AVG_PRICE.NAME, payload, callback);
  }

  /**
   * 订阅深度信息
   */
  subscribeDepth(symbols: string[], level: BinanceEnums.Level, interval: BinanceEnums.Interval, callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] };
    payload.params = symbols.map(symbol => `${symbol.toLowerCase()}@${BinanceEnums.SpotWsApi.DEPTH.ENDPOINT}${level}@${interval}`);

    this.marketWsClient.subscribe(BinanceEnums.SpotWsApi.DEPTH.NAME, payload, callback);
  }

  /**
   * 订阅K线
   */
  subscribeKline(symbols: string[], interval: BinanceEnums.Interval, callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] }
    payload.params = symbols.map( symbol => `${symbol.toLowerCase()}@${BinanceEnums.SpotWsApi.KLINE.ENDPOINT}_${interval}`);

    this.marketWsClient.subscribe(BinanceEnums.SpotWsApi.KLINE.NAME, payload, callback)
  }

  /**
   * 订阅最优挂单信息
   */
  subscribeBookTicker(symbols: string[], callback: (data: any) => void) {
    let payload: Record<string, any> = { params: [] }
    payload.params = symbols.map( symbol => `${symbol.toLowerCase()}@${BinanceEnums.SpotWsApi.BOOK_TICKER.ENDPOINT}`);

    this.marketWsClient.subscribe(BinanceEnums.SpotWsApi.BOOK_TICKER.NAME, payload, callback);
  }

  /**
   * 订阅精简Ticker
   */
  subscribeMiniTicker(symbols: string[], callback: (data: any)=> void) {
    let payload: Record<string, any> = { params: []};
    if(symbols.length <= 0) {
      payload.params = [`!${BinanceEnums.SpotWsApi.MINI_TICKER.ENDPOINT}@arr`];
    } else {
      payload.params = symbols.map( symbol => `${symbol.toLowerCase()}@${BinanceEnums.SpotWsApi.MINI_TICKER.ENDPOINT}`)
    }

    this.marketWsClient.subscribe(BinanceEnums.SpotWsApi.MINI_TICKER.NAME, payload, callback);
  }

}
