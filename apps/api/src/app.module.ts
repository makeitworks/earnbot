import { Module } from '@nestjs/common';
import { MarketsModule } from './modules/markets/markets.module';
import { ExchangesModule } from './modules/exchanges/exchanges.module';
import { EventModule } from './modules/event/event.module';


@Module({
  imports: [MarketsModule, ExchangesModule, EventModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
