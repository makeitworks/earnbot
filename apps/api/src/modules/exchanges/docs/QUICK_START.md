# 交易所集成快速开始指南

## 环境准备

### 1. 安装依赖

```bash
cd /workspaces/apps/api
npm install axios ws
npm install --save-dev @types/ws
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
# Binance
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_api_secret

# OKX
OKX_API_KEY=your_okx_api_key
OKX_API_SECRET=your_okx_api_secret
OKX_PASSPHRASE=your_okx_passphrase
```

## 核心概念

### 产品类型 (ProductType)

每个交易所支持不同的产品类型：

| 产品类型 | Binance | OKX | 说明 |
|---------|--------|-----|------|
| SPOT | 现货 (Spot) | 现货 (Spot) | 现货交易 |
| USDT_FUTURES | USDT 永续合约 (Perpetual) | Swap | USDT本位合约 |
| COIN_FUTURES | 币本位永续合约 (Perpetual) | Futures | 币本位合约 |

### 订单类型 (OrderType)

- `LIMIT` - 限价单
- `MARKET` - 市价单

## 快速示例

### 示例 1: 获取实时行情

```typescript
// 文件: src/app.service.ts
import { Injectable } from '@nestjs/common';
import { ExchangeFactory, ExchangeType } from './modules/exchanges/factory/exchange.factory';
import { ProductType } from './modules/exchanges/common/enums/product-type.enum';

@Injectable()
export class AppService {
  async getLatestPrice() {
    // 创建 Binance 交易所实例
    const exchange = ExchangeFactory.createExchange(
      ExchangeType.BINANCE,
      process.env.BINANCE_API_KEY,
      process.env.BINANCE_API_SECRET,
    );

    // 获取现货产品服务
    const spotService = exchange.getProduct(ProductType.SPOT);

    // 获取 BTC/USDT 的实时行情
    const ticker = await spotService.getTicker('BTC/USDT');

    return {
      symbol: ticker.symbol,
      lastPrice: ticker.lastPrice,
      priceChangePercent: ticker.priceChangePercent,
      highPrice: ticker.highPrice,
      lowPrice: ticker.lowPrice,
      volume: ticker.volume,
    };
  }
}
```

### 示例 2: 获取K线数据

```typescript
async getKlines() {
  const exchange = ExchangeFactory.createExchange(
    ExchangeType.BINANCE,
    process.env.BINANCE_API_KEY,
    process.env.BINANCE_API_SECRET,
  );

  const spotService = exchange.getProduct(ProductType.SPOT);

  // 获取 BTC/USDT 的1小时K线（最近100根）
  const klines = await spotService.getKlines('BTC/USDT', '1h', 100);

  return klines.map((kline) => ({
    time: new Date(kline.openTime).toISOString(),
    open: kline.open,
    high: kline.high,
    low: kline.low,
    close: kline.close,
    volume: kline.volume,
  }));
}
```

### 示例 3: 下单

```typescript
import { OrderType } from './modules/exchanges/common/enums/order-type.enum';

async placeOrder() {
  const exchange = ExchangeFactory.createExchange(
    ExchangeType.BINANCE,
    process.env.BINANCE_API_KEY,
    process.env.BINANCE_API_SECRET,
  );

  const spotService = exchange.getProduct(ProductType.SPOT);

  // 下买单：以 30000 USDT 的价格买入 0.1 BTC
  const order = await spotService.placeOrder({
    symbol: 'BTC/USDT',
    type: OrderType.LIMIT,
    side: 'BUY',
    quantity: 0.1,
    price: 30000,
  });

  return {
    orderId: order.orderId,
    status: order.status,
    price: order.price,
    quantity: order.quantity,
    executedQty: order.executedQty,
  };
}
```

### 示例 4: 订阅实时行情 (WebSocket)

```typescript
async subscribePrices() {
  const exchange = ExchangeFactory.createExchange(
    ExchangeType.BINANCE,
    process.env.BINANCE_API_KEY,
    process.env.BINANCE_API_SECRET,
  );

  const spotService = exchange.getProduct(ProductType.SPOT);

  // 订阅 BTC 和 ETH 的实时行情
  await spotService.subscribeTicker(['BTC/USDT', 'ETH/USDT'], (ticker) => {
    console.log(`${ticker.symbol}: ${ticker.lastPrice} (${ticker.priceChangePercent}%)`);
  });

  // 保持连接活跃（可选）
  // 应用关闭时调用: await spotService.disconnectAll();
}
```

### 示例 5: 订阅K线数据 (WebSocket)

```typescript
async subscribeKlineData() {
  const exchange = ExchangeFactory.createExchange(
    ExchangeType.BINANCE,
    process.env.BINANCE_API_KEY,
    process.env.BINANCE_API_SECRET,
  );

  const spotService = exchange.getProduct(ProductType.SPOT);

  // 订阅 BTC/USDT 的1分钟K线
  await spotService.subscribeKline(['BTC/USDT'], '1m', (kline) => {
    console.log(`Kline: ${kline.symbol} ${kline.interval}`);
    console.log(`Close: ${kline.close}, Volume: ${kline.volume}`);
  });
}
```

### 示例 6: 获取账户余额

```typescript
async getAccountBalance() {
  const exchange = ExchangeFactory.createExchange(
    ExchangeType.BINANCE,
    process.env.BINANCE_API_KEY,
    process.env.BINANCE_API_SECRET,
  );

  const spotService = exchange.getProduct(ProductType.SPOT);

  const balance = await spotService.getBalance();

  // balance 结构:
  // {
  //   BTC: { free: 1.0, locked: 0.5 },
  //   USDT: { free: 5000, locked: 2000 },
  //   ...
  // }

  return Object.entries(balance).map(([asset, { free, locked }]) => ({
    asset,
    free,
    locked,
    total: free + locked,
  }));
}
```

### 示例 7: 多交易所支持

```typescript
async getPriceFromMultipleExchanges(symbol: string) {
  const exchanges = [
    { type: ExchangeType.BINANCE, key: process.env.BINANCE_API_KEY, secret: process.env.BINANCE_API_SECRET },
    { type: ExchangeType.OKX, key: process.env.OKX_API_KEY, secret: process.env.OKX_API_SECRET, passphrase: process.env.OKX_PASSPHRASE },
  ];

  const results = await Promise.all(
    exchanges.map(async (ex) => {
      const exchange = ExchangeFactory.createExchange(ex.type, ex.key, ex.secret, ex.passphrase);
      const spotService = exchange.getProduct(ProductType.SPOT);
      const ticker = await spotService.getTicker(symbol);
      return {
        exchange: exchange.name,
        price: ticker.lastPrice,
        timestamp: ticker.timestamp,
      };
    }),
  );

  return results;
}
```

## NestJS 模块集成

### 1. 创建 Exchange 配置服务

```typescript
// src/config/exchange.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExchangeConfig {
  constructor(private configService: ConfigService) {}

  getBinanceConfig() {
    return {
      apiKey: this.configService.get('BINANCE_API_KEY'),
      apiSecret: this.configService.get('BINANCE_API_SECRET'),
    };
  }

  getOkxConfig() {
    return {
      apiKey: this.configService.get('OKX_API_KEY'),
      apiSecret: this.configService.get('OKX_API_SECRET'),
      passphrase: this.configService.get('OKX_PASSPHRASE'),
    };
  }
}
```

### 2. 创建 Exchange Service Provider

```typescript
// src/modules/exchanges/exchanges.service.ts
import { Injectable } from '@nestjs/common';
import { ExchangeFactory, ExchangeType } from './factory/exchange.factory';
import { ProductType } from './common/enums/product-type.enum';
import { IExchange } from './common/interfaces/exchange.interface';
import { IProduct } from './common/interfaces/product.interface';
import { ExchangeConfig } from '../../config/exchange.config';

@Injectable()
export class ExchangesService {
  private exchanges: Map<string, IExchange> = new Map();

  constructor(private exchangeConfig: ExchangeConfig) {}

  private getOrCreateExchange(exchangeType: ExchangeType): IExchange {
    if (this.exchanges.has(exchangeType)) {
      return this.exchanges.get(exchangeType)!;
    }

    let exchange: IExchange;

    switch (exchangeType) {
      case ExchangeType.BINANCE:
        const binanceConfig = this.exchangeConfig.getBinanceConfig();
        exchange = ExchangeFactory.createExchange(
          exchangeType,
          binanceConfig.apiKey,
          binanceConfig.apiSecret,
        );
        break;

      case ExchangeType.OKX:
        const okxConfig = this.exchangeConfig.getOkxConfig();
        exchange = ExchangeFactory.createExchange(
          exchangeType,
          okxConfig.apiKey,
          okxConfig.apiSecret,
          okxConfig.passphrase,
        );
        break;

      default:
        throw new Error(`Unsupported exchange: ${exchangeType}`);
    }

    this.exchanges.set(exchangeType, exchange);
    return exchange;
  }

  getBinance(): IExchange {
    return this.getOrCreateExchange(ExchangeType.BINANCE);
  }

  getOkx(): IExchange {
    return this.getOrCreateExchange(ExchangeType.OKX);
  }

  getProduct(exchange: ExchangeType, product: ProductType): IProduct {
    const exchangeInstance = this.getOrCreateExchange(exchange);
    return exchangeInstance.getProduct(product);
  }
}
```

### 3. 在 Module 中注册

```typescript
// src/modules/exchanges/exchanges.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExchangesService } from './exchanges.service';
import { ExchangeConfig } from '../../config/exchange.config';
import { BinanceModule } from './binance/binance.module';
import { OkxModule } from './okx/okx.module';

@Module({
  imports: [ConfigModule, BinanceModule, OkxModule],
  providers: [ExchangesService, ExchangeConfig],
  exports: [ExchangesService, ExchangeConfig],
})
export class ExchangesModule {}
```

## 常见问题

### Q1: 如何处理 API 错误？

```typescript
try {
  const ticker = await spotService.getTicker('BTC/USDT');
} catch (error) {
  if (error.response?.status === 401) {
    // API密钥错误
  } else if (error.response?.status === 429) {
    // 速率限制
  } else {
    // 其他错误
  }
}
```

### Q2: 如何关闭 WebSocket 连接？

```typescript
// 关闭所有 WebSocket 连接
await spotService.disconnectAll();
```

### Q3: 支持哪些 K线 周期？

Binance:
- `1m`, `3m`, `5m`, `15m`, `30m`
- `1h`, `2h`, `4h`, `6h`, `8h`, `12h`
- `1d`, `3d`, `1w`, `1M`

OKX:
- `1m`, `3m`, `5m`, `15m`, `30m`
- `1h`, `2h`, `4h`, `6h`, `8h`, `12h`
- `1d`, `1w`, `1M`, `3M`

### Q4: 如何实现多交易所套利？

```typescript
async findArbitrage(symbol: string) {
  const binancePrice = (await this.getBinance().getProduct(ProductType.SPOT).getTicker(symbol)).lastPrice;
  const okxPrice = (await this.getOkx().getProduct(ProductType.SPOT).getTicker(symbol)).lastPrice;

  const spread = (okxPrice - binancePrice) / binancePrice * 100;

  return {
    binancePrice,
    okxPrice,
    spread,
    opportunity: spread > 0.5, // 差价大于 0.5% 时有套利机会
  };
}
```

## 性能优化

1. **连接复用** - 使用单例模式复用交易所实例
2. **缓存** - 缓存不经常变化的数据（交易对信息）
3. **批量请求** - 使用批量接口获取多个交易对的数据
4. **WebSocket** - 使用 WebSocket 替代定期轮询获取实时数据
5. **异步处理** - 使用 Promise.all() 并发请求

## 安全建议

1. ⚠️ **不要在代码中硬编码 API 密钥**
2. ✅ 使用环境变量存储敏感信息
3. ✅ 考虑使用密钥管理服务（如 AWS Secrets Manager）
4. ✅ 定期轮换 API 密钥
5. ✅ 限制 API 密钥的权限范围
6. ✅ 监控异常 API 活动

## 下一步

- [ ] 实现更多交易所
- [ ] 添加订单簿管理
- [ ] 实现策略引擎
- [ ] 添加风险管理工具
- [ ] 实现交易记录和分析
