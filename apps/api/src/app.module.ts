import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MarketsModule } from './modules/markets/markets.module';
import { EventModule } from './modules/event/event.module';
import { BinanceModule } from './modules/binance/binance.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './database/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongodbModule } from './database/mongodb/mongodb.module';
import mongodbConfig from './config/mongodb.config';
import redisConfig from './config/redis.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        mongodbConfig,
        redisConfig,
      ]
    }),
    ScheduleModule.forRoot(),
    MarketsModule, 
    EventModule, 
    BinanceModule, 
    RedisModule, 
    AuthModule, 
    UserModule, 
    MongodbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
