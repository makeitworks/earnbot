import { Module } from '@nestjs/common';
import { OkxService } from './okx.service';

/**
 * OKX 交易所模块（内部模块）
 * 注意：OkxService 不导出，统一通过 ExchangeFactory 使用
 * API 凭证从环境变量读取，如果不提供则支持公开数据访问
 */
@Module({
  providers: [
    {
      provide: OkxService,
      useFactory: () => {
        const apiKey = process.env.OKX_API_KEY;
        const apiSecret = process.env.OKX_API_SECRET;
        const passphrase = process.env.OKX_PASSPHRASE;
        // 凭证可选 - 如果没有提供，仅用于公开数据访问
        return new OkxService(apiKey, apiSecret, passphrase);
      },
    },
  ],
})
export class OkxModule {}
