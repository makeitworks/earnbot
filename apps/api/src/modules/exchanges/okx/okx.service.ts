import { Injectable } from '@nestjs/common';
import { IExchange } from '../common/interfaces/exchange.interface';
import { IProduct } from '../common/interfaces/product.interface';
import { ProductType } from '../common/enums/product-type.enum';
import { BaseExchange } from '../core/base-exchange';
import { OkxSpotService } from './spot/spot.service';

/**
 * OKX 交易所主服务
 * 提供对所有 OKX 产品的访问
 * API 凭证可选，用户可以获取公开市场数据而不需要凭证
 */
@Injectable()
export class OkxService extends BaseExchange implements IExchange {
  readonly name = 'OKX';
  private apiKey?: string;
  private apiSecret?: string;
  private passphrase?: string;

  constructor(apiKey?: string, apiSecret?: string, passphrase?: string) {
    super();
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.passphrase = passphrase;

    // 注册现货产品
    const spotService = new OkxSpotService(apiKey, apiSecret, passphrase);
    this.registerProduct(ProductType.SPOT, spotService);

    // TODO: 注册 Swap 产品（USDT本位合约）
    // const swapService = new OkxSwapService(apiKey, apiSecret, passphrase);
    // this.registerProduct(ProductType.USDT_FUTURES, swapService);

    // TODO: 注册期货产品（币本位合约）
    // const futuresService = new OkxFuturesService(apiKey, apiSecret, passphrase);
    // this.registerProduct(ProductType.COIN_FUTURES, futuresService);
  }

  /**
   * 验证API密钥是否有效
   */
  async validateCredentials(): Promise<boolean> {
    try {
      const spotService = this.getProduct(ProductType.SPOT) as OkxSpotService;
      await spotService.getBalance();
      return true;
    } catch (error) {
      return false;
    }
  }
}

