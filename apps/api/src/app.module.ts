import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MarketsModule } from './modules/markets/markets.module';
import { EventModule } from './modules/event/event.module';
import { BinanceModule } from './modules/binance/binance.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MarketsModule, 
    EventModule, 
    BinanceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
