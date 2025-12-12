import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MarketsModule } from './modules/markets/markets.module';
import { EventModule } from './modules/event/event.module';
import { BinanceModule } from './modules/binance/binance.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './database/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    MarketsModule, 
    EventModule, 
    BinanceModule, 
    RedisModule, AuthModule, UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
