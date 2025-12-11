import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { BinanceModule } from '../binance/binance.module';
import { RedisModule } from '../../database/redis/redis.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    EventModule,
    RedisModule,
    BinanceModule,
  ],
  providers: [MarketsService],
  controllers: [MarketsController]
})
export class MarketsModule {}
