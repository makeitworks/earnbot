/**
 * 订单状态枚举
 */
export enum OrderStatus {
  /**
   * 新建订单
   */
  NEW = 'NEW',

  /**
   * 部分成交
   */
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',

  /**
   * 完全成交
   */
  FILLED = 'FILLED',

  /**
   * 已取消
   */
  CANCELLED = 'CANCELLED',

  /**
   * 待撤销中
   */
  PENDING_CANCEL = 'PENDING_CANCEL',

  /**
   * 已过期
   */
  EXPIRED = 'EXPIRED',
}
