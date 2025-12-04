import { Module } from '@nestjs/common';
import { BinanceModule } from './binance/binance.module';
import { ExchangeFactory } from './factory/exchange.factory';

/**
 * 交易所集成主模块
 *
 * 结构:
 * - BinanceModule: Binance 交易所集成（内部模块）
 * - OkxModule: OKX 交易所集成（内部模块）
 * - ExchangeFactory: 统一入口
 *
 * 使用方式:
 * 所有模块统一通过 ExchangeFactory.createExchange() 来获取交易所实例
 * 这样保证了代码的一致性和可维护性
 *
 * 环境变量配置(需要通过数据库获取，因为有多个用户，每个用户有不同的API凭证):
 * - BINANCE_API_KEY
 * - BINANCE_API_SECRET
 * - OKX_API_KEY
 * - OKX_API_SECRET
 * - OKX_PASSPHRASE
 */
@Module({
  imports: [
    BinanceModule,  // 导入 Binance 模块
    // OkxModule,      // 导入 OKX 模块
  ],
  providers: [
    ExchangeFactory,  // 工厂类作为提供者
  ],
  exports: [
    ExchangeFactory,   // 只导出工厂类作为统一入口
  ],
})
export class ExchangesModule {}
