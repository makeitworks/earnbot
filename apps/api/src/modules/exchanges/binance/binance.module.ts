import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';

/**
 * Binance 交易所模块（内部模块）
 * 注意：BinanceService 不导出，统一通过 ExchangeFactory 使用
 * API 凭证从环境变量读取，如果不提供则支持公开数据访问
 */
@Module({
  providers: [
    {
      provide: BinanceService,
      useFactory: () => {
        const apiKey = process.env.BINANCE_API_KEY;
        const apiSecret = process.env.BINANCE_API_SECRET;
        // 凭证可选 - 如果没有提供，仅用于公开数据访问
        return new BinanceService(apiKey, apiSecret);
      },
    },
  ],
})
export class BinanceModule {}
