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

  /**
   * 向客户端推送价格信息
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  async pushSymbolPrice() {
    // 获取现货Mini Ticker数据
    let spotTickers: BinanceSpotMiniTicker[] = [];
    let spotSymbolKeys = await this.redisService.scan(`${RedisEnums.KeyPrefix.BINANCE_SPOT_MINI_TICKER}:*`);
    await Promise.all(
      spotSymbolKeys.map(async key => {
        let ticker = await this.redisService.getJson<BinanceSpotMiniTicker>(key);
        spotTickers.push(ticker);
      })
    );

    // 获取Coin-Margin 合约 Mini Ticker 数据
    let cmfTickers : BinanceCMFMiniTicker[] = [];
    let cmfSymbolKeys = await this.redisService.scan(`${RedisEnums.KeyPrefix.BINANCE_CMF_MINI_TICKER}:*`);
    await Promise.all(
      cmfSymbolKeys.map( async key => {
        let ticker = await this.redisService.getJson<BinanceCMFMiniTicker>(key);
        cmfTickers.push(ticker);
      })
    );

    this.eventGateway.broadcast(EventEnums.EventNameEnum.MINI_TICKER, { spotTickers, cmfTickers });
  }

  /**
   * 现货行情数据websocket连接开启
   */
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
    this.binanceSpotService.subscribeMiniTicker([], this.onSpotMiniTickerCallback.bind(this));

    // 将symbol信息缓存到redis
    allSymbols.map( symbolInfo => this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_SPOT_SYMBOL}:${symbolInfo.symbol}`, symbolInfo, RedisEnums.KeyDefaultExpireInSec) );
  }

  /**
   * 现货行情数据websocket连接关闭
   */
  onSpotMarketWsClose() {
    this.logger.warn('[binance] spot market websocket closed!');
  }

  /**
   * Coin-Margin合约行情数据Websocket连接开启
   */
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
    this.binanceCMFService.subscribeMiniTicker([], this.onCMFMiniTickerCallback.bind(this));

    // 将symbol信息缓存到redis
    allSymbols.map(symbolInfo => this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_CMF_SYMBOL}:${symbolInfo.symbol}`, symbolInfo, RedisEnums.KeyDefaultExpireInSec));
  }

  /**
   * Coin-Margin合约行情数据websocket 连接关闭
   */
  onCMFMarketWsClose() {
    this.logger.warn('[binance] coin-margin future market websocket closed!');
  }

  /**
   * Coin-Margin合约最优挂单数据推送回调
   */
  onCMFBookTickerCallback(data: BinanceCMFBookTicker) {
    this.redisService.setJson(
      `${RedisEnums.KeyPrefix.BINANCE_CMF_BOOK_TICKER}:${data.s}`,
      data,
      RedisEnums.KeyDefaultExpireInSec,
    );
  }

  /**
   * 现货最佳挂单数据推送回调
   */
  onSpotBookTickerCallback(data: BinanceSpotBookTicker) {
    this.redisService.setJson(
      `${RedisEnums.KeyPrefix.BINANCE_SPOT_BOOK_TICKER}:${data.s}`,
      data,
      RedisEnums.KeyDefaultExpireInSec,
    );
  }

  /**
   * MiniTicker推送数据回调
   */
  onCMFMiniTickerCallback(data: BinanceCMFMiniTicker[] ) {
    data.forEach( item => {
      this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_CMF_MINI_TICKER}:${item.s}`, item, RedisEnums.KeyDefaultExpireInSec);
    });
  }

  /**
   * Coin-Margin 合约深度数据推送回调
   */
  onCMFDepthCallback(data: BinanceCMFDepth) {
    this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_CMF_DEPTH}:${data.s}`, data, RedisEnums.KeyDefaultExpireInSec);
  }

  /**
   * 现货 MiniTicker数据推送回调
   */
  onSpotMiniTickerCallback(data: BinanceSpotMiniTicker[]) {
    data.forEach( item => {
      // 过滤非 USDT交易对
      if( item.s.toUpperCase().includes('USDT') ) {
        this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_SPOT_MINI_TICKER}:${item.s}`, item, RedisEnums.KeyDefaultExpireInSec);
      }
    })
  }

  /**
   * 现货深度数据推送回调(因为无symbol信息，暂时未实现)
   */
  onSpotDepthCallback(data: BinanceSpotDepth) {
    // this.redisService.setJson(`${RedisEnums.KeyPrefix.BINANCE_SPOT_DEPTH}:${data}`, data, RedisEnums.KeyDefaultExpireInSec);
  }

}
