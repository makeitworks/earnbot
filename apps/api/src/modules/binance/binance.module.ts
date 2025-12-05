import { Module } from '@nestjs/common';
import { BinanceSpotService } from './spot/spot.service';
import { BinanceCMFutureService } from './cmfuture/cmfuture.service';
import { BinanceSpotRestClient } from './spot/spot.rest.client';
import { BinanceSpotMarketWsClient } from './spot/market.ws.client';
import { BinanceCMFutureRestClient } from './cmfuture/spot.rest.client';
import { BinanceCMFutureWsClient } from './cmfuture/market.ws.client';


@Module({
  providers: [
    // Spot
    BinanceSpotRestClient,
    BinanceSpotMarketWsClient,
    BinanceSpotService,

    // CMFuture
    BinanceCMFutureRestClient,
    BinanceCMFutureWsClient,
    BinanceCMFutureService,
  ],
  exports: [
    BinanceSpotService,
    BinanceCMFutureService,
  ],
})
export class BinanceModule {}
