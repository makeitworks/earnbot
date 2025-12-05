import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { BinanceModule } from '../binance/binance.module';

@Module({
  imports: [BinanceModule],
  providers: [MarketsService],
  controllers: [MarketsController]
})
export class MarketsModule {}
