# 快速参考 - 可选凭证 API

## 三行代码快速开始

```typescript
// 无凭证 - 仅公开数据
const exchange = ExchangeFactory.createExchange(ExchangeType.BINANCE);

// 有凭证 - 完整功能
const exchange = ExchangeFactory.createExchange(ExchangeType.BINANCE, apiKey, apiSecret);
```

## API 签名

### Binance
```typescript
// 无凭证
const binance = ExchangeFactory.createExchange(ExchangeType.BINANCE);

// 有凭证
const binance = ExchangeFactory.createExchange(
  ExchangeType.BINANCE,
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET
);
```

### OKX
```typescript
// 无凭证
const okx = ExchangeFactory.createExchange(ExchangeType.OKX);

// 有凭证
const okx = ExchangeFactory.createExchange(
  ExchangeType.OKX,
  process.env.OKX_API_KEY,
  process.env.OKX_API_SECRET,
  process.env.OKX_PASSPHRASE
);
```

## 常见操作

### 获取行情数据（无需凭证）
```typescript
const exchange = ExchangeFactory.createExchange(ExchangeType.BINANCE);
const spot = exchange.getProduct(ProductType.SPOT);

// 获取Ticker
const ticker = await spot.getTicker('BTCUSDT');
console.log(ticker.lastPrice);

// 获取K线
const klines = await spot.getKlines('BTCUSDT', '1h', 100);

// 获取交易对信息
const symbols = await spot.getExchangeInfo();
```

### 账户和交易操作（需要凭证）
```typescript
const exchange = ExchangeFactory.createExchange(
  ExchangeType.BINANCE,
  apiKey,
  apiSecret
);
const spot = exchange.getProduct(ProductType.SPOT);

// 获取余额
const balance = await spot.getBalance();

// 下单
const order = await spot.createOrder({
  symbol: 'BTCUSDT',
  side: 'BUY',
  type: 'LIMIT',
  quantity: 0.01,
  price: 50000,
});

// 查询订单
const orderInfo = await spot.getOrder('BTCUSDT', order.orderId);

// 取消订单
await spot.cancelOrder('BTCUSDT', order.orderId);
```

### WebSocket 实时数据

```typescript
const exchange = ExchangeFactory.createExchange(ExchangeType.BINANCE);
const spot = exchange.getProduct(ProductType.SPOT);

// 订阅行情（无需凭证）
await spot.subscribeTicker(['BTCUSDT'], (ticker) => {
  console.log(`${ticker.symbol}: $${ticker.lastPrice}`);
});

// 订阅K线（无需凭证）
await spot.subscribeKline(['BTCUSDT'], '1m', (kline) => {
  console.log(`${kline.symbol}: O=${kline.open} C=${kline.close}`);
});

// 订阅账户数据（需要凭证）
const authExchange = ExchangeFactory.createExchange(
  ExchangeType.BINANCE,
  apiKey,
  apiSecret
);
const authSpot = authExchange.getProduct(ProductType.SPOT);

await authSpot.subscribeBalance((balance) => {
  console.log('余额更新', balance);
});

await authSpot.subscribeOrders((order) => {
  console.log('订单更新', order);
});
```

## 环境变量配置

```bash
# Binance
export BINANCE_API_KEY=your_api_key
export BINANCE_API_SECRET=your_api_secret

# OKX
export OKX_API_KEY=your_api_key
export OKX_API_SECRET=your_api_secret
export OKX_PASSPHRASE=your_passphrase
```

## 条件判断

```typescript
const exchange = ExchangeFactory.createExchange(
  ExchangeType.BINANCE,
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET
);

const hasCredentials = !!process.env.BINANCE_API_KEY && 
                      !!process.env.BINANCE_API_SECRET;

if (hasCredentials) {
  // 可以执行需要认证的操作
  const balance = await exchange.getProduct(ProductType.SPOT).getBalance();
} else {
  // 仅能访问公开数据
  const ticker = await exchange.getProduct(ProductType.SPOT).getTicker('BTCUSDT');
}
```

## 错误处理

```typescript
try {
  const exchange = ExchangeFactory.createExchange(ExchangeType.BINANCE);
  const ticker = await exchange.getProduct(ProductType.SPOT).getTicker('BTCUSDT');
} catch (error) {
  if (error.code === 'INVALID_SYMBOL') {
    console.error('交易对不存在');
  } else if (error.code === 'UNAUTHORIZED') {
    console.error('API凭证无效');
  } else {
    console.error('网络错误:', error.message);
  }
}
```

## 参数说明

### ExchangeFactory.createExchange()

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| exchangeType | ExchangeType | ✅ | BINANCE \| OKX |
| apiKey | string | ❌ | API密钥，可选 |
| apiSecret | string | ❌ | API密钥，可选 |
| passphrase | string | ❌ | OKX专用，可选 |

### 返回值
- 返回类型: `IExchange`
- 包含方法: `getProduct(productType)` - 获取产品服务

### Product 方法

**公开方法**（无需凭证）
- `getTicker(symbol)` - 获取行情
- `getTickers(symbols)` - 批量获取行情
- `getKlines(symbol, interval, limit)` - 获取K线
- `getSymbolInfo(symbol)` - 获取交易对信息
- `getExchangeInfo()` - 获取交易所信息
- `subscribeTicker(symbols, callback)` - 订阅行情
- `subscribeKline(symbols, interval, callback)` - 订阅K线

**私有方法**（需要凭证）
- `getBalance()` - 获取余额
- `createOrder(orderRequest)` - 下单
- `getOrder(symbol, orderId)` - 查询订单
- `cancelOrder(symbol, orderId)` - 取消订单
- `getOrders(symbol, status)` - 查询订单历史
- `subscribeBalance(callback)` - 订阅余额更新
- `subscribeOrders(callback)` - 订阅订单更新

---

**提示**: 所有无凭证方法随时可用，私有方法在无凭证时会抛出错误提示。
