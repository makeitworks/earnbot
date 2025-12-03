import { OrderType } from '../enums/order-type.enum';
import { OrderStatus } from '../enums/order-status.enum';

/**
 * 订单请求参数
 */
export interface OrderRequest {
  /**
   * 交易对 e.g. BTC/USDT
   */
  symbol: string;

  /**
   * 订单类型: LIMIT 或 MARKET
   */
  type: OrderType;

  /**
   * 买卖方向: BUY 或 SELL
   */
  side: 'BUY' | 'SELL';

  /**
   * 订单数量
   */
  quantity: number;

  /**
   * 订单价格 (LIMIT订单必填)
   */
  price?: number;

  /**
   * 客户端订单ID (可选)
   */
  clientOrderId?: string;

  /**
   * 其他交易所特定参数
   */
  extra?: Record<string, any>;
}

/**
 * 订单信息
 */
export interface Order extends OrderRequest {
  /**
   * 交易所订单ID
   */
  orderId: string;

  /**
   * 订单状态
   */
  status: OrderStatus;

  /**
   * 已成交数量
   */
  executedQty: number;

  /**
   * 已成交金额
   */
  cummulativeQuoteQty: number;

  /**
   * 平均成交价
   */
  avgPrice?: number;

  /**
   * 手续费
   */
  fees?: number;

  /**
   * 创建时间
   */
  createdAt: number;

  /**
   * 更新时间
   */
  updatedAt: number;
}
