import { ProductType } from '../common/enums/product-type.enum';
import { IExchange } from '../common/interfaces/exchange.interface';
import { BinanceService } from '../binance/binance.service';
import { OkxService } from '../okx/okx.service';

/**
 * 交易所类型
 */
export enum ExchangeType {
  BINANCE = 'BINANCE',
  OKX = 'OKX',
}

/**
 * 交易所工厂
 * 用于创建交易所实例
 */
export class ExchangeFactory {
  /**
   * 创建交易所实例
   */
  static createExchange(
    exchangeType: ExchangeType,
    apiKey: string,
    apiSecret: string,
    passphrase?: string,
  ): IExchange {
    switch (exchangeType) {
      case ExchangeType.BINANCE:
        return new BinanceService(apiKey, apiSecret);
      case ExchangeType.OKX:
        if (!passphrase) {
          throw new Error('OKX requires passphrase');
        }
        return new OkxService(apiKey, apiSecret, passphrase);
      default:
        throw new Error(`Unknown exchange type: ${exchangeType}`);
    }
  }

  /**
   * 获取交易所支持的产品类型
   */
  static getSupportedProducts(exchangeType: ExchangeType): ProductType[] {
    switch (exchangeType) {
      case ExchangeType.BINANCE:
      case ExchangeType.OKX:
        return [ProductType.SPOT];
      // TODO: 添加合约产品
      default:
        return [];
    }
  }
}
