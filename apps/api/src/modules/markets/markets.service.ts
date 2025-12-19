import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BinanceSpotService } from '../binance/spot/service';
import { BinanceCMFService } from '../binance/cmf/service';
import {
  BinanceCMFBookTicker,
  BinanceCMFDepth,
  BinanceCMFMiniTicker,
  BinanceCMFSymbolInfo,
  BinanceSpotBookTicker,
  BinanceSpotDepth,
  BinanceSpotMiniTicker,
  BinanceSpotSymbolInfo,
} from '../../common/dto/binance.dto';
import { RedisService } from '../../database/redis/redis.service';
import * as RedisEnums from '../../common/enums/redis.enums';
import { EventGateway } from '../event/event.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SymbolPrice } from '../../common/dto/common.dto';
import * as EventEnums from '../../common/enums/event.enums';
import { sleepAWhile } from '../../common/utils/utils';

@Injectable()
export class MarketsService implements OnModuleInit {
  private readonly logger = new Logger(MarketsService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly binanceSpotService: BinanceSpotService,
    private readonly binanceCMFService: BinanceCMFService,
    private readonly eventGateway: EventGateway,
  ) {}

  onModuleInit() {
    // 初始化现货 Websocket 行情推送
    this.binanceSpotService.initialize(
      this.onSpotMarketWsOpen.bind(this),
      this.onSpotMarketWsClose.bind(this),
    );

    // 初始化币本位合约 Websocket 行情推送
    this.binanceCMFService.initalize(
      this.onCMFMarketWsOpen.bind(this),
      this.onCMFMarketWsClose.bind(this),
    );
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async pushSymbolPrice() {
    let priceList : SymbolPrice[] = [];

    // 获取价格
    let spotKeys = await this.redisService.scan(`${RedisEnums.KeyPrefix.BINANCE_SPOT_BOOK_TICKER}:*`);
    await Promise.all(
      spotKeys.map( async (key)=> {
        let bookTicker = await this.redisService.getJson<BinanceSpotBookTicker>(key);
        let price: SymbolPrice = {
          symbol: bookTicker.s,
          buy: bookTicker.B,
          sell: bookTicker.a
        };
        priceList.push(price);
      })
    )
    // 
    let cmfKeys = await this.redisService.scan(`${RedisEnums.KeyPrefix.BINANCE_CMF_BOOK_TICKER}:*`);
    await Promise.all(
      cmfKeys.map(async (key)=> {
        let bookTicker = await this.redisService.getJson<BinanceCMFBookTicker>(key);
        let price: SymbolPrice = {
          symbol: bookTicker.s,
          buy: bookTicker.b,
          sell: bookTicker.a
        }
        priceList.push(price);
      })
    )
    this.eventGateway.broadcast(EventEnums.EventNameEnum.SYMBOL_PRICE, priceList);
  }

  async onSpotMarketWsOpen() {
    this.logger.log('[binance] spot market websocket opened!');
    let allSymbols: BinanceSpotSymbolInfo[] = [];
    
    do {
      try {
        allSymbols = await this.binanceSpotService.getExchangeInfo();
        if(allSymbols.length <= 0) {
          throw new Error('getExchangeInfo failed with empty data');
        }
        break;
      } catch(err) {
        this.logger.error(err.message);
        sleepAWhile(3000);
        continue;
      }  
    } while(true);

    // 订阅websocket市场数据流(全市场所有Symbol的精简Ticker)
    // 1.订阅全市场精简Ticker
    this.binanceSpotService.subscribeMiniTicker([], this.onSpotMiniTickerCallback.bind(this));

    // 将symbol信息缓存到redis
    allSymbols.map( symbolInfo => this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_SPOT_SYMBOL}:${symbolInfo.symbol}`, symbolInfo, RedisEnums.KeyDefaultExpireInSec) );
  }

  onSpotMarketWsClose() {
    this.logger.warn('[binance] spot market websocket closed!');
  }

  async onCMFMarketWsOpen() {
    this.logger.log('[binance] coin-margin future market websocket opened!');

    let allSymbols: BinanceCMFSymbolInfo[] = [];
    do {
      try {
        // 获取所有对信息
        allSymbols = await this.binanceCMFService.getExchangeInfo();
        if (allSymbols.length <= 0) {
          throw new Error('getExchangeInfo with empty.');
        }
        break;
      } catch (err) {
        this.logger.error(err.message);
        // sleep 3 seconds and try again
        await sleepAWhile(3000);
        continue;
      }
    } while (true);

    // 订阅websocket市场数据流(全市场所有Symbol的精简Ticker)
    // 1. 订阅全市场symbol精简Ticker
    this.binanceCMFService.subscribeMiniTicker([], this.onCMFMiniTickerCallback.bind(this));

    // 将symbol信息缓存到redis
    allSymbols.map(symbolInfo => this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_CMF_SYMBOL}:${symbolInfo.symbol}`, symbolInfo, RedisEnums.KeyDefaultExpireInSec));
  }

  onCMFMarketWsClose() {
    this.logger.warn('[binance] coin-margin future market websocket closed!');
  }

  /**
   * 可以在onCMFBookTickerCallback,onSpotBookTickerCallback回调中检测机会
   */
  onCMFBookTickerCallback(data: BinanceCMFBookTicker) {
    this.redisService.setJson(
      `${RedisEnums.KeyPrefix.BINANCE_CMF_BOOK_TICKER}:${data.s}`,
      data,
      RedisEnums.KeyDefaultExpireInSec,
    );
  }

  onSpotBookTickerCallback(data: BinanceSpotBookTicker) {
    this.redisService.setJson(
      `${RedisEnums.KeyPrefix.BINANCE_SPOT_BOOK_TICKER}:${data.s}`,
      data,
      RedisEnums.KeyDefaultExpireInSec,
    );
  }

  /**
   * MiniTicker
   */
  onCMFMiniTickerCallback(data: BinanceCMFMiniTicker[] ) {
    data.forEach( item => {
      this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_CMF_MINI_TICKER}:${item.s}`, item, RedisEnums.KeyDefaultExpireInSec);
    });
  }

  /**
   * Coin-Margin 合约深度信息
   */
  onCMFDepthCallback(data: BinanceCMFDepth) {
    this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_CMF_DEPTH}:${data.s}`, data, RedisEnums.KeyDefaultExpireInSec);
  }

  /**
   * Spot MiniTicker
   */
  onSpotMiniTickerCallback(data: BinanceSpotMiniTicker[]) {
    data.forEach( item => {
      this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_SPOT_MINI_TICKER}:${item.s}`, item, RedisEnums.KeyDefaultExpireInSec);
    })
  }

  /**
   * Spot Depth Callback
   */
  onSpotDepthCallback(data: BinanceSpotDepth) {
    // this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_SPOT_DEPTH}:${data}`, data, RedisEnums.KeyDefaultExpireInSec);
  }

}
