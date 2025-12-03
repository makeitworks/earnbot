import { Module } from '@nestjs/common';
import { BinanceService } from './binance/binance.service';
import { OkxService } from './okx/okx.service';
import { ExchangeFactory } from './factory/exchange.factory';
import { BinanceSpotService } from './binance/spot/spot.service';
import { OkxSpotService } from './okx/spot/spot.service';

@Module({
  providers: [
    BinanceService,
    OkxService,
    BinanceSpotService,
    OkxSpotService,
    ExchangeFactory,
  ],
  exports: [
    BinanceService,
    OkxService,
    ExchangeFactory,
  ],
})
export class ExchangesModule {}
