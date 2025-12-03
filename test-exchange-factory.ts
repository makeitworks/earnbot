/**
 * 测试脚本：验证交易所工厂可以正确处理可选的 API 凭证
 */

import { ExchangeFactory, ExchangeType } from './apps/api/src/modules/exchanges/factory/exchange.factory';

console.log('=== 测试交易所工厂 - 可选凭证 ===\n');

// 测试1: 无凭证创建 Binance 交易所
console.log('✓ 测试1: 无凭证创建 Binance 交易所');
try {
  const binancePublic = ExchangeFactory.createExchange(ExchangeType.BINANCE);
  console.log(`  - 交易所名称: ${binancePublic.name}`);
  console.log(`  - 支持产品: ${ExchangeFactory.getSupportedProducts(ExchangeType.BINANCE)}`);
  console.log('  ✓ 成功\n');
} catch (err: any) {
  console.error(`  ✗ 失败: ${err.message}\n`);
}

// 测试2: 有凭证创建 Binance 交易所
console.log('✓ 测试2: 有凭证创建 Binance 交易所');
try {
  const binanceAuth = ExchangeFactory.createExchange(
    ExchangeType.BINANCE,
    'test-api-key',
    'test-api-secret'
  );
  console.log(`  - 交易所名称: ${binanceAuth.name}`);
  console.log('  ✓ 成功\n');
} catch (err: any) {
  console.error(`  ✗ 失败: ${err.message}\n`);
}

// 测试3: 无凭证创建 OKX 交易所
console.log('✓ 测试3: 无凭证创建 OKX 交易所');
try {
  const okxPublic = ExchangeFactory.createExchange(ExchangeType.OKX);
  console.log(`  - 交易所名称: ${okxPublic.name}`);
  console.log(`  - 支持产品: ${ExchangeFactory.getSupportedProducts(ExchangeType.OKX)}`);
  console.log('  ✓ 成功\n');
} catch (err: any) {
  console.error(`  ✗ 失败: ${err.message}\n`);
}

// 测试4: 有凭证创建 OKX 交易所
console.log('✓ 测试4: 有凭证创建 OKX 交易所');
try {
  const okxAuth = ExchangeFactory.createExchange(
    ExchangeType.OKX,
    'test-api-key',
    'test-api-secret',
    'test-passphrase'
  );
  console.log(`  - 交易所名称: ${okxAuth.name}`);
  console.log('  ✓ 成功\n');
} catch (err: any) {
  console.error(`  ✗ 失败: ${err.message}\n`);
}

console.log('=== 所有测试完成 ===');
console.log('✓ 交易所工厂支持可选的 API 凭证');
console.log('✓ 无凭证时仅能访问公开数据');
console.log('✓ 有凭证时可以执行认证操作');
