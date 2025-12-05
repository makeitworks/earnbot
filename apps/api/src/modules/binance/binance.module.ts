import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceSpotRestClient } from './spot/rest.client';
import { BinanceSpotMarketWsClient } from './spot/market-ws.client';

@Module({
  providers: [
    BinanceSpotRestClient,      // ✅ 注册 REST 客户端
    BinanceSpotMarketWsClient,  // ✅ 注册 WebSocket 客户端
    BinanceService,              // ✅ 注册聚合服务
  ],
  exports: [
    BinanceService,  // ✅ 只导出聚合服务
  ],
})
export class BinanceModule {}
