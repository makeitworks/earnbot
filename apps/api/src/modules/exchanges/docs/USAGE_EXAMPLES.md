// 交易所集成 - 实际使用示例
// 此文件为文档示例，展示如何使用交易所 API

/*
===== 示例 1: 无凭证获取公开市场数据 =====

// 创建无凭证的交易所实例
const binance = ExchangeFactory.createExchange(ExchangeType.BINANCE);
const spotService = binance.getProduct(ProductType.SPOT);

// 获取行情数据
const ticker = await spotService.getTicker('BTCUSDT');
console.log('BTC 当前价格:', ticker);

// 获取 K 线数据
const klines = await spotService.getKlines('BTCUSDT', '1h', 10);
console.log('BTCUSDT 最近 10 根 1h K线:', klines);

// 获取交易对信息
const symbolInfo = await spotService.getSymbolInfo('BTCUSDT');
console.log('BTCUSDT 交易对信息:', symbolInfo);


===== 示例 2: 有凭证执行交易操作 =====

// 创建有凭证的交易所实例
const binance = ExchangeFactory.createExchange(
  ExchangeType.BINANCE,
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET
);
const spotService = binance.getProduct(ProductType.SPOT);

// 获取账户余额
const balance = await spotService.getBalance();
console.log('账户余额:', balance);

// 下单
const order = await spotService.createOrder({
  symbol: 'BTCUSDT',
  side: 'BUY',
  type: 'LIMIT',
  quantity: 0.01,
  price: 50000,
});
console.log('下单结果:', order);

// 查询订单
const orderInfo = await spotService.getOrder('BTCUSDT', order.orderId);
console.log('订单信息:', orderInfo);


===== 示例 3: OKX 无凭证公开数据 =====

// 创建无凭证的 OKX 实例
const okx = ExchangeFactory.createExchange(ExchangeType.OKX);
const spotService = okx.getProduct(ProductType.SPOT);

// 获取行情数据
const ticker = await spotService.getTicker('BTCUSDT');
console.log('OKX BTC 当前价格:', ticker);

// 获取 K 线数据
const klines = await spotService.getKlines('BTCUSDT', '1h', 10);
console.log('OKX BTCUSDT 最近 10 根 1h K线:', klines);


===== 示例 4: OKX 有凭证执行交易 =====

// 创建有凭证的 OKX 实例（包括 passphrase）
const okx = ExchangeFactory.createExchange(
  ExchangeType.OKX,
  process.env.OKX_API_KEY,
  process.env.OKX_API_SECRET,
  process.env.OKX_PASSPHRASE
);
const spotService = okx.getProduct(ProductType.SPOT);

// 获取账户资产
const balance = await spotService.getBalance();
console.log('账户资产:', balance);

// 下单
const order = await spotService.createOrder({
  symbol: 'BTCUSDT',
  side: 'BUY',
  type: 'LIMIT',
  quantity: 0.01,
  price: 50000,
});
console.log('下单结果:', order);


===== 示例 5: 监听 WebSocket 实时数据 =====

// 创建实例（无凭证可以订阅公开数据流）
const binance = ExchangeFactory.createExchange(ExchangeType.BINANCE);
const spotService = binance.getProduct(ProductType.SPOT);

// 订阅行情数据
await spotService.subscribeTicker(['BTCUSDT', 'ETHUSDT'], (ticker) => {
  console.log(`实时行情 - ${ticker.symbol}: $${ticker.lastPrice}`);
});

// 订阅 K 线数据
await spotService.subscribeKline(['BTCUSDT'], '1m', (kline) => {
  console.log(`实时 K线 - ${kline.symbol} ${kline.interval}: O=${kline.open} C=${kline.close}`);
});

// 订阅用户数据流（需要有凭证）
const binanceAuth = ExchangeFactory.createExchange(
  ExchangeType.BINANCE,
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET
);
const spotServiceAuth = binanceAuth.getProduct(ProductType.SPOT);

// 订阅账户更新
await spotServiceAuth.subscribeBalance((balance) => {
  console.log(`账户余额更新:`, balance);
});

// 订阅订单更新
await spotServiceAuth.subscribeOrders((order) => {
  console.log(`订单更新:`, order);
});


===== 示例 6: 处理可选凭证的场景 =====

// 创建交易所实例
const exchange = ExchangeFactory.createExchange(
  ExchangeType.BINANCE,
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET
);

const spotService = exchange.getProduct(ProductType.SPOT);

// 总是可以获取公开数据
const ticker = await spotService.getTicker('BTCUSDT');
console.log('公开数据 - 最新价格:', ticker.lastPrice);

// 检查凭证是否可用
const hasCredentials = !!process.env.BINANCE_API_KEY && !!process.env.BINANCE_API_SECRET;

if (hasCredentials) {
  // 有凭证时执行交易操作
  const balance = await spotService.getBalance();
  console.log('认证数据 - 账户余额:', balance);

  // 可以下单
  const order = await spotService.createOrder({
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 0.01,
    price: 50000,
  });
  console.log('订单已下单:', order.orderId);
} else {
  console.log('无凭证，仅可访问公开数据');
  console.log('要执行交易，请设置环境变量: BINANCE_API_KEY 和 BINANCE_API_SECRET');
}
*/
