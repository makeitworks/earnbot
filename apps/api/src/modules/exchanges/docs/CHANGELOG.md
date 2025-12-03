# 变更日志 - v1.1.0

## 新增功能

### 可选 API 凭证支持
- ✨ **核心改动**: 所有交易所和产品服务的 API 凭证参数现为可选
- ✨ **灵活访问**: 支持无凭证公开数据访问和有凭证完整功能访问
- ✨ **自动检测**: 基类自动检测凭证可用性（`hasCredentials` 标志）

## 改进

### 代码架构
- 📝 更新文档，添加 `OPTIONAL_CREDENTIALS.md`
- 📝 创建 `ITERATION_SUMMARY.md` 总结迭代内容
- 📝 创建 `QUICK_REFERENCE.md` 快速参考指南
- 🔧 优化 Binance 和 OKX 模块，使用工厂提供者

### 类型系统
- 🎯 所有可选参数使用正确的 TypeScript `?:` 语法
- 🎯 保持完整的类型安全

### 模块配置
- 🔌 使用 `useFactory` 从环境变量读取凭证
- 🔌 凭证缺失时不强制要求，使用 undefined

## 修改详情

### 核心基类 (2个)
```typescript
// BaseRestClient
- constructor(baseUrl, apiKey?: string, apiSecret?: string)
+ 添加 hasCredentials 属性

// BaseWebsocketClient
- constructor(baseUrl, apiKey?: string, apiSecret?: string)
+ 添加 hasCredentials 属性
```

### Binance 服务 (4个)
```typescript
// BinanceService
- constructor(apiKey: string, apiSecret: string)
+ constructor(apiKey?: string, apiSecret?: string)

// BinanceSpotService
- constructor(apiKey: string, apiSecret: string)
+ constructor(apiKey?: string, apiSecret?: string)

// BinanceSpotRestClient
- constructor(apiKey: string, apiSecret: string)
+ constructor(apiKey?: string, apiSecret?: string)

// BinanceSpotWebsocketClient
- constructor(apiKey: string, apiSecret: string)
+ constructor(apiKey?: string, apiSecret?: string)
```

### OKX 服务 (4个)
```typescript
// OkxService
- constructor(apiKey: string, apiSecret: string, passphrase: string)
+ constructor(apiKey?: string, apiSecret?: string, passphrase?: string)
+ 属性现为可选类型

// OkxSpotService
- constructor(apiKey: string, apiSecret: string, passphrase: string)
+ constructor(apiKey?: string, apiSecret?: string, passphrase?: string)

// OkxSpotRestClient
- constructor(apiKey: string, apiSecret: string, passphrase: string)
+ constructor(apiKey?: string, apiSecret?: string, passphrase?: string)
+ passphrase 现为可选属性

// OkxSpotWebsocketClient
- constructor(apiKey: string, apiSecret: string, passphrase: string)
+ constructor(apiKey?: string, apiSecret?: string, passphrase?: string)
+ passphrase 现为可选属性
```

### 工厂类 (1个)
```typescript
// ExchangeFactory
- createExchange(type, apiKey: string, apiSecret: string, passphrase?: string)
+ createExchange(type, apiKey?: string, apiSecret?: string, passphrase?: string)
+ 更新文档和使用示例
```

### 模块配置 (2个)
```typescript
// BinanceModule
+ 使用 useFactory 提供者
+ 从 process.env 读取凭证

// OkxModule
+ 使用 useFactory 提供者
+ 从 process.env 读取凭证
```

## 新增文档

| 文件 | 描述 |
|------|------|
| `OPTIONAL_CREDENTIALS.md` | 详细设计文档和使用场景 |
| `ITERATION_SUMMARY.md` | 迭代总结和变更列表 |
| `QUICK_REFERENCE.md` | 快速参考和代码示例 |

## 向后兼容性

✅ **完全兼容** - 现有代码无需任何修改
- 所有新参数都是可选的
- 行为改变最小化
- API 签名扩展，不修改

## 测试覆盖

- ✅ 编译检查通过
- ✅ 应用启动正常
- ✅ NestJS 模块初始化正常
- ✅ 所有依赖注入正确解析

## 版本信息

- **版本**: v1.1.0
- **发布日期**: 2025-12-03
- **破坏性改动**: 无
- **新增API**: 否（参数扩展）

## 待做项

- [ ] 实现 REST API 签名逻辑
- [ ] 实现 WebSocket 用户数据流
- [ ] 添加单元测试
- [ ] 实现合约产品支持
- [ ] 性能优化

---

**升级说明**: 无需任何操作，直接升级使用即可。现有代码会继续正常工作，新代码可以利用可选凭证特性。
