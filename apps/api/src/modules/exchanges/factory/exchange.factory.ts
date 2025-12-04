import { ProductType } from '../common/enums/product-type.enum';
import { IExchange } from '../common/interfaces/exchange.interface';
import { BinanceService } from '../binance/binance.service';
// import { OkxService } from '../okx/okx.service';

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
 * 支持创建无凭证的交易所实例（仅用于公开数据访问）或有凭证的实例（支持交易和账户操作）
 */
export class ExchangeFactory {
  /**
   * 创建交易所实例
   * @param exchangeType 交易所类型
   * @param apiKey 可选的 API Key
   * @param apiSecret 可选的 API Secret
   * @param passphrase 可选的通行码（OKX 专用）
   * @returns 交易所实例
   * 
   * 使用示例:
   * // 无凭证 - 仅用于公开数据访问
   * const publicBinance = ExchangeFactory.createExchange(ExchangeType.BINANCE);
   * 
   * // 有凭证 - 支持交易和账户操作
   * const binance = ExchangeFactory.createExchange(ExchangeType.BINANCE, apiKey, apiSecret);
   * const okx = ExchangeFactory.createExchange(ExchangeType.OKX, apiKey, apiSecret, passphrase);
   */
  static createExchange(
    exchangeType: ExchangeType,
    apiKey?: string,
    apiSecret?: string,
    passphrase?: string,
  ): IExchange {
    switch (exchangeType) {
      case ExchangeType.BINANCE:
        return new BinanceService(apiKey, apiSecret);
      case ExchangeType.OKX:
        // OKX 如果提供了凭证，则 passphrase 是可选的，但如果提供 apiKey，建议也提供 passphrase
        // return new OkxService(apiKey, apiSecret, passphrase);
        throw new Error(`Unknown exchange type: ${exchangeType}`)
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
