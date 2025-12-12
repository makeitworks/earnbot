import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { BinanceSpotService } from './spot/service';
import { BinanceCMFService } from './cmf/service';
import { BinanceSpotRestClient } from './spot/rest.client';
import { BinanceSpotMarketWsClient } from './spot/market.ws.client';
<<<<<<< HEAD
import { BinanceCMFRestClient } from './cmf/cmf.rest.client';
=======
import { BinanceCMFRestClient } from './cmf/rest.client';
>>>>>>> 3fbb35eaee9df3f6b2c1e2f907cd04f7be2ff3c5
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
