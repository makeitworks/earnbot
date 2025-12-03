import { Injectable } from '@nestjs/common';
import { IExchange } from '../common/interfaces/exchange.interface';
import { IProduct } from '../common/interfaces/product.interface';
import { ProductType } from '../common/enums/product-type.enum';
import { BaseExchange } from '../core/base-exchange';
import { BinanceSpotService } from './spot/spot.service';

/**
 * Binance 交易所主服务
 * 提供对所有 Binance 产品的访问
 * API 凭证可选，用户可以获取公开市场数据而不需要凭证
 */
@Injectable()
export class BinanceService extends BaseExchange implements IExchange {
  readonly name = 'Binance';

  constructor(apiKey?: string, apiSecret?: string) {
    super();

    // 注册现货产品
    const spotService = new BinanceSpotService(apiKey, apiSecret);
    this.registerProduct(ProductType.SPOT, spotService);

    // TODO: 注册 USDT 永续合约产品
    // const usdtFuturesService = new BinanceUsdtFuturesService(apiKey, apiSecret);
    // this.registerProduct(ProductType.USDT_FUTURES, usdtFuturesService);

    // TODO: 注册币本位合约产品
    // const coinFuturesService = new BinanceCoinFuturesService(apiKey, apiSecret);
    // this.registerProduct(ProductType.COIN_FUTURES, coinFuturesService);
  }

  /**
   * 验证API密钥是否有效
   */
  async validateCredentials(): Promise<boolean> {
    try {
      const spotService = this.getProduct(ProductType.SPOT) as BinanceSpotService;
      await spotService.getBalance();
      return true;
    } catch (error) {
      return false;
    }
  }
}
