import { IExchange } from '../common/interfaces/exchange.interface';
import { IProduct } from '../common/interfaces/product.interface';
import { ProductType } from '../common/enums/product-type.enum';
import { Logger } from '@nestjs/common';

/**
 * 交易所基类
 * 提供所有交易所的通用功能
 */
export abstract class BaseExchange implements IExchange {
  protected logger = new Logger(this.constructor.name);

  abstract readonly name: string;

  protected products: Map<ProductType, IProduct> = new Map();

  /**
   * 注册产品实现
   */
  protected registerProduct(productType: ProductType, product: IProduct): void {
    this.products.set(productType, product);
    this.logger.log(
      `Product registered: ${productType} for ${this.name}`,
    );
  }

  /**
   * 获取指定产品类型的服务实例
   */
  getProduct(productType: ProductType): IProduct {
    const product = this.products.get(productType);
    if (!product) {
      throw new Error(
        `Product type ${productType} is not supported by ${this.name}`,
      );
    }
    return product;
  }

  /**
   * 获取支持的所有产品类型
   */
  getSupportedProducts(): ProductType[] {
    return Array.from(this.products.keys());
  }

  /**
   * 验证API密钥是否有效
   */
  abstract validateCredentials(): Promise<boolean>;
}
