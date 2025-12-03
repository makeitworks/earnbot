import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceSpotService } from './spot/spot.service';

@Module({
  providers: [BinanceService, BinanceSpotService],
  exports: [BinanceService],
})
export class BinanceModule {}
