import { ProductType } from '../enums/product-type.enum';
import { IProduct } from './product.interface';

/**
 * 交易所接口
 * 定义交易所的统一操作接口
 */
export interface IExchange {
  /**
   * 交易所名称
   */
  readonly name: string;

  /**
   * 获取指定产品类型的服务实例
   * @param productType 产品类型 (SPOT, USDT_FUTURES, COIN_FUTURES)
   */
  getProduct(productType: ProductType): IProduct;

  /**
   * 获取支持的所有产品类型
   */
  getSupportedProducts(): ProductType[];

  /**
   * 验证API密钥是否有效
   */
  validateCredentials(): Promise<boolean>;
}
