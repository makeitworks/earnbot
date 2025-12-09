import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { BinanceSpotService } from './spot/spot.service';
import { BinanceCMFService } from './cmf/cmf.service';
import { BinanceSpotRestClient } from './spot/spot.rest.client';
import { BinanceSpotMarketWsClient } from './spot/market.ws.client';
import { BinanceCMFRestClient } from './cmf/spot.rest.client';
import { BinanceCMFMarketWsClient } from './cmf/market.ws.client';

@Module({
  providers: [
    // Spot
    BinanceSpotRestClient,
    BinanceSpotMarketWsClient,
    BinanceSpotService,

    // Coin-Margin Future
    BinanceCMFRestClient,
    BinanceCMFMarketWsClient,
    BinanceCMFService,

    // USDT-Margin Future

  ],
  exports: [
    BinanceSpotService,
    BinanceCMFService,
    // BinanceUMFService,
  ],
})
export class BinanceModule { }
