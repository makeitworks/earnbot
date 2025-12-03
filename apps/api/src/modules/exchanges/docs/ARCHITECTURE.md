# 交易所API集成架构设计文档

## 概述

本文档详细说明了如何在 NestJS 项目中集成多个交易所的 REST API 和 WebSocket 接口，采用分层 + 策略模式设计。

## 架构设计图

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│              (Controllers, Services, etc.)               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                  Exchange Factory                        │
│        (Create and manage exchange instances)            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Exchange Interface (IExchange)              │
│         - getProduct(ProductType): IProduct             │
│         - getSupportedProducts(): ProductType[]          │
│         - validateCredentials(): boolean                 │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    ┌─────▼──────┐        ┌─────▼──────┐
    │  Binance   │        │    OKX     │
    │  (Concrete)│        │  (Concrete)│
    └─────┬──────┘        └─────┬──────┘
          │                     │
    ┌─────┴──────────────────────────┐
    │   Product Interface (IProduct)  │
    │  - placeOrder()                 │
    │  - cancelOrder()                │
    │  - getTicker()                  │
    │  - subscribeKline()             │
    └─────┬──────────────────────────┘
          │
    ┌─────┴────────────────┐
    │                      │
┌───▼────────┐      ┌──────▼──────┐
│ Spot       │      │  USDT       │
│ Product    │      │  Futures    │
└───┬────────┘      └──────┬──────┘
    │                      │
┌───┴────────────┬─────────┴──────────────┐
│                │                        │
│         REST API Client        WebSocket Client
│         (HTTP Requests)        (Live Streams)
└────────────────┴────────────────────────┘
```

## 目录结构

```
exchanges/
├── common/
│   ├── enums/
│   │   ├── product-type.enum.ts       # 产品类型
│   │   ├── order-type.enum.ts         # 订单类型
│   │   └── order-status.enum.ts       # 订单状态
│   ├── types/
│   │   ├── ticker.type.ts             # 行情数据
│   │   ├── order.type.ts              # 订单数据
│   │   └── kline.type.ts              # K线数据
│   ├── interfaces/
│   │   ├── exchange.interface.ts       # 交易所接口
│   │   ├── product.interface.ts        # 产品接口
│   │   └── market-data.interface.ts    # 市场数据接口
│   └── dto/
│       ├── place-order.dto.ts
│       └── market-data.dto.ts
├── core/
│   ├── base-exchange.ts                # 交易所基类
│   ├── rest-client.ts                  # REST客户端基类
│   └── websocket-client.ts             # WebSocket基类
├── binance/
│   ├── rest/
│   │   ├── spot-rest.client.ts
│   │   ├── usdt-futures-rest.client.ts
│   │   └── coin-futures-rest.client.ts
│   ├── websocket/
│   │   ├── spot-websocket.client.ts
│   │   ├── usdt-futures-ws.client.ts
│   │   └── coin-futures-ws.client.ts
│   ├── spot/
│   │   ├── spot.service.ts
│   │   └── spot.module.ts
│   ├── usdt-futures/
│   │   ├── usdt-futures.service.ts
│   │   └── usdt-futures.module.ts
│   ├── coin-futures/
│   │   ├── coin-futures.service.ts
│   │   └── coin-futures.module.ts
│   ├── binance.service.ts              # 主服务
│   ├── binance.module.ts
│   └── types/
│       └── binance.types.ts
├── okx/
│   ├── rest/
│   │   ├── spot-rest.client.ts
│   │   ├── swap-rest.client.ts
│   │   └── futures-rest.client.ts
│   ├── websocket/
│   │   ├── spot-websocket.client.ts
│   │   ├── swap-ws.client.ts
│   │   └── futures-ws.client.ts
│   ├── spot/
│   │   ├── spot.service.ts
│   │   └── spot.module.ts
│   ├── swap/
│   │   ├── swap.service.ts
│   │   └── swap.module.ts
│   ├── futures/
│   │   ├── futures.service.ts
│   │   └── futures.module.ts
│   ├── okx.service.ts                  # 主服务
│   ├── okx.module.ts
│   └── types/
│       └── okx.types.ts
├── factory/
│   └── exchange.factory.ts             # 工厂模式
└── exchanges.module.ts
```

## 核心设计原则

### 1. **接口驱动开发**

所有交易所实现都基于统一接口：
- `IExchange` - 交易所接口
- `IProduct` - 产品接口（现货、合约等）
- `IMarketData` - 市场数据接口

### 2. **分层架构**

```
Client/Service (使用方)
    ↓
Exchange Service (交易所服务: BinanceService, OkxService)
    ↓
Product Service (产品服务: SpotService, FuturesService)
    ↓
REST Client + WebSocket Client
    ↓
HTTP/WebSocket
    ↓
Exchange API
```

### 3. **策略模式**

每个交易所、每个产品都可以有不同的实现，但都遵循相同的接口。

### 4. **客户端分离**

- `RestClient` - 处理 HTTP 请求，用于 REST API
- `WebsocketClient` - 处理 WebSocket 连接，用于实时流数据

## 使用示例

### 基础使用

```typescript
import { ExchangeFactory, ExchangeType } from './factory/exchange.factory';
import { ProductType } from './common/enums/product-type.enum';

// 1. 创建交易所实例
const exchange = ExchangeFactory.createExchange(
  ExchangeType.BINANCE,
  'your-api-key',
  'your-api-secret'
);

// 2. 获取现货产品服务
const spotService = exchange.getProduct(ProductType.SPOT);

// 3. 获取行情数据
const ticker = await spotService.getTicker('BTC/USDT');
console.log(ticker);

// 4. 获取K线数据
const klines = await spotService.getKlines('BTC/USDT', '1h', 100);
console.log(klines);

// 5. 订阅实时行情
await spotService.subscribeTicker(['BTC/USDT', 'ETH/USDT'], (ticker) => {
  console.log('New ticker:', ticker);
});

// 6. 订阅K线数据
await spotService.subscribeKline(['BTC/USDT'], '1m', (kline) => {
  console.log('New kline:', kline);
});

// 7. 下单
const order = await spotService.placeOrder({
  symbol: 'BTC/USDT',
  type: OrderType.LIMIT,
  side: 'BUY',
  quantity: 0.1,
  price: 30000,
});

// 8. 查询订单
const orderInfo = await spotService.getOrder('BTC/USDT', order.orderId);

// 9. 取消订单
await spotService.cancelOrder('BTC/USDT', order.orderId);

// 10. 获取账户余额
const balance = await spotService.getBalance();

// 11. 断开WebSocket
await spotService.disconnectAll();
```

### NestJS Service 中使用

```typescript
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ExchangeFactory, ExchangeType } from './factory/exchange.factory';
import { ProductType } from './common/enums/product-type.enum';
import { IExchange } from './common/interfaces/exchange.interface';
import { IProduct } from './common/interfaces/product.interface';

@Injectable()
export class ExchangeService implements OnModuleDestroy {
  private exchanges: Map<string, IExchange> = new Map();

  /**
   * 创建或获取交易所实例
   */
  getExchange(exchangeName: string): IExchange {
    if (this.exchanges.has(exchangeName)) {
      return this.exchanges.get(exchangeName)!;
    }

    const apiKey = process.env[`${exchangeName}_API_KEY`];
    const apiSecret = process.env[`${exchangeName}_API_SECRET`];
    const passphrase = process.env[`${exchangeName}_PASSPHRASE`];

    const exchange = ExchangeFactory.createExchange(
      exchangeName as ExchangeType,
      apiKey,
      apiSecret,
      passphrase,
    );

    this.exchanges.set(exchangeName, exchange);
    return exchange;
  }

  /**
   * 获取产品服务
   */
  getProduct(
    exchangeName: string,
    productType: ProductType,
  ): IProduct {
    const exchange = this.getExchange(exchangeName);
    return exchange.getProduct(productType);
  }

  /**
   * 清理资源
   */
  async onModuleDestroy() {
    for (const exchange of this.exchanges.values()) {
      const spot = exchange.getProduct(ProductType.SPOT);
      await spot.disconnectAll();
    }
  }
}
```

### 在 Controller 中使用

```typescript
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ProductType } from './common/enums/product-type.enum';
import { OrderType } from './common/enums/order-type.enum';
import { OrderRequest } from './common/types/order.type';

@Controller('exchanges')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get(':exchange/ticker/:symbol')
  async getTicker(
    @Param('exchange') exchange: string,
    @Param('symbol') symbol: string,
  ) {
    const spotService = this.exchangeService.getProduct(
      exchange,
      ProductType.SPOT,
    );
    return spotService.getTicker(symbol);
  }

  @Get(':exchange/klines/:symbol/:interval')
  async getKlines(
    @Param('exchange') exchange: string,
    @Param('symbol') symbol: string,
    @Param('interval') interval: string,
  ) {
    const spotService = this.exchangeService.getProduct(
      exchange,
      ProductType.SPOT,
    );
    return spotService.getKlines(symbol, interval);
  }

  @Post(':exchange/order')
  async placeOrder(
    @Param('exchange') exchange: string,
    @Body() orderRequest: OrderRequest,
  ) {
    const spotService = this.exchangeService.getProduct(
      exchange,
      ProductType.SPOT,
    );
    return spotService.placeOrder(orderRequest);
  }

  @Get(':exchange/balance')
  async getBalance(@Param('exchange') exchange: string) {
    const spotService = this.exchangeService.getProduct(
      exchange,
      ProductType.SPOT,
    );
    return spotService.getBalance();
  }
}
```

## 添加新交易所步骤

### 1. 创建交易所目录结构
```
new-exchange/
├── rest/
│   └── spot-rest.client.ts
├── websocket/
│   └── spot-websocket.client.ts
├── spot/
│   └── spot.service.ts
├── new-exchange.service.ts
└── new-exchange.module.ts
```

### 2. 创建 REST 客户端

```typescript
import { BaseRestClient } from '../../core/rest-client';

export class NewExchangeSpotRestClient extends BaseRestClient {
  constructor(apiKey: string, apiSecret: string) {
    super('https://api.newexchange.com', apiKey, apiSecret);
  }

  async getTicker(symbol: string): Promise<Ticker> {
    // 实现具体逻辑
  }
  
  // ... 其他方法
}
```

### 3. 创建 WebSocket 客户端

```typescript
import { BaseWebsocketClient } from '../../core/websocket-client';

export class NewExchangeSpotWebsocketClient extends BaseWebsocketClient {
  constructor(apiKey: string, apiSecret: string) {
    super('wss://ws.newexchange.com', apiKey, apiSecret);
  }

  async subscribeTicker(...) {
    // 实现订阅逻辑
  }

  protected handleMessage(data: any) {
    // 处理消息
  }
}
```

### 4. 创建产品服务

```typescript
export class NewExchangeSpotService implements IProduct {
  // 实现 IProduct 接口
}
```

### 5. 创建交易所主服务

```typescript
export class NewExchangeService extends BaseExchange {
  constructor(apiKey: string, apiSecret: string) {
    super();
    const spotService = new NewExchangeSpotService(apiKey, apiSecret);
    this.registerProduct(ProductType.SPOT, spotService);
  }

  async validateCredentials(): Promise<boolean> {
    // 验证逻辑
  }
}
```

### 6. 在工厂中注册

```typescript
switch (exchangeType) {
  case ExchangeType.NEW_EXCHANGE:
    return new NewExchangeService(apiKey, apiSecret);
}
```

## 依赖管理

需要安装的包：

```bash
npm install axios ws
npm install --save-dev @types/node @types/ws
```

## 最佳实践

1. **错误处理** - 添加统一的错误处理机制
2. **日志记录** - 使用 NestJS Logger 记录所有API调用
3. **速率限制** - 实现请求速率限制
4. **缓存策略** - 缓存不经常变化的数据（如交易对信息）
5. **重试机制** - 为失败的请求添加重试逻辑
6. **类型安全** - 使用 TypeScript 确保类型安全
7. **测试** - 为每个客户端编写单元测试
8. **文档** - 维护 API 文档和使用示例

## 扩展计划

- [ ] Binance USDT 永续合约
- [ ] Binance 币本位合约
- [ ] OKX Swap（USDT本位合约）
- [ ] OKX 期货（币本位合约）
- [ ] Kraken 集成
- [ ] Bybit 集成
- [ ] Deribit 集成
- [ ] 统一的订单簿管理
- [ ] 策略引擎集成
