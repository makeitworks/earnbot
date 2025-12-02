import { Module } from '@nestjs/common';
import { BinanceService } from './binance/binance.service';
import { OkxService } from './okx/okx.service';


@Module({
  providers: [BinanceService, OkxService]
})
export class ExchangesModule {}
