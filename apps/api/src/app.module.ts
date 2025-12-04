import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MarketsModule } from './modules/markets/markets.module';
import { ExchangesModule } from './modules/exchanges/exchanges.module';
import { EventModule } from './modules/event/event.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MarketsModule, 
    ExchangesModule, 
    EventModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
