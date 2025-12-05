import { Module } from '@nestjs/common';
import { BinanceSpotService } from './spot/spot.service';


@Module({
  providers: [
    BinanceSpotService,
  ],
  exports: [
    BinanceSpotService,  // ✅ 只导出聚合服务
  ],
})
export class BinanceModule {}
