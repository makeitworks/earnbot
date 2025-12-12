import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BinanceSpotService } from '../binance/spot/service';
import { BinanceCMFService } from '../binance/cmf/service';
import {
  BinanceCMFBookTicker,
  BinanceCMFSymbolInfo,
  BinanceSpotBookTicker,
  BinanceSpotSymbolInfo,
} from '../../common/dto/binance.dto';
import { RedisService } from '../../database/redis/redis.service';
import * as RedisEnums from '../../common/enums/redis.enums';
import * as BinanceEnums from '../../common/enums/binance.enums';
import { EventGateway } from '../event/event.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SymbolPrice } from '../../common/dto/common.dto';

import * as EventEnums from '../../common/enums/event.enums';

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
    this.logger.log('--------> start')
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

  async onSpotMarketWsOpen(symbols?: string[]) {
    this.logger.log(
      symbols
        ? '[binance] subscribe spot market data'
        : '[binance] spot market websocket opened!',
    );
    if (symbols) {
      // GET SPOT SYMBOLS
      let spotSymbols: BinanceSpotSymbolInfo[] =
        await this.binanceSpotService.getPairsFromEx(symbols);
      // 将现货交易对信息缓存到Redis

      await Promise.all(
        spotSymbols.map((symbolInfo) =>
          this.redisService.setJson(
            `${RedisEnums.KeyPrefix.BINANCE_SPOT_SYMBOL}:${symbolInfo.symbol}`,
            symbolInfo,
            RedisEnums.KeyDefaultExpireInSec,
          ),
        ),
      );
    }

    // 获取交易对列表
    let allKeys = await this.redisService.scan(
      `${RedisEnums.KeyPrefix.BINANCE_SPOT_SYMBOL}:*`,
    );

    let spotSymbols: Record<string, boolean> = {};
    allKeys.forEach((key) => {
      spotSymbols[key] = true;
    });

    // 订阅最佳挂单信息
     const infoPromises = Object.keys(spotSymbols).map((key) => 
        this.redisService.getJson<BinanceSpotSymbolInfo>(key)
    );

    // 2. 等待所有读取操作完成
    const allInfos = await Promise.all(infoPromises);

    const watchSpotSymbols = allInfos
        .filter((info) => info && info.status === BinanceEnums.TradeStatus.TRADING) // 过滤掉 null 和非交易状态
        .map((info) => info.symbol); // 提取 symbol 字段

    if (watchSpotSymbols.length <= 0) {
      return;
    }

    this.binanceSpotService.subscribeBookTicker(
      watchSpotSymbols,
      this.onSpotBookTickerCallback.bind(this),
    );
  }

  onSpotMarketWsClose() {
    this.logger.warn('[binance] spot market websocket closed!');
  }

  async onCMFMarketWsOpen() {
    this.logger.log('[binance] coin-margin future market websocket opened!');
    // 获取交易对
    let data: BinanceCMFSymbolInfo[] =
      await this.binanceCMFService.getExchangeInfo();

    // 订阅Coin-Margin合约交易对的最佳挂单信息
    let watchCMFSymbols: string[] = [];

    // 订阅现货交易对最佳挂单信息
    let watchSpotSymbols: Record<string, boolean> = {};

    // 将交易对数据缓存到redis
    data.forEach((symbolInfo) => {
      this.redisService.setJson(
        `${RedisEnums.KeyPrefix.BINANCE_CMF_SYMBOL}:${symbolInfo.symbol}`,
        symbolInfo,
        RedisEnums.KeyDefaultExpireInSec,
      );

      watchCMFSymbols.push(symbolInfo.symbol);

      watchSpotSymbols[`${symbolInfo.baseAsset}USDT`] = true;
    });

    this.binanceCMFService.subscribeBookTicker(
      watchCMFSymbols,
      this.onCMFBookTickerCallback.bind(this),
    );

    this.onSpotMarketWsOpen(Object.keys(watchSpotSymbols));
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
}
