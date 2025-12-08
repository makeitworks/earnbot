import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis.Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      db: this.configService.get('REDIS_DB', 0),
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  /**
   * 获取值
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * 设置值
   */
  async set(
    key: string,
    value: string | Buffer | number,
    exSecond?: number,
  ): Promise<void> {
    if (exSecond) {
      await this.client.setex(key, exSecond, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * 删除键
   */
  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) > 0;
  }

  /**
   * 设置过期时间(秒)
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    return (await this.client.expire(key, seconds)) > 0;
  }

  /**
   * 获取剩余过期时间
   */
  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  /**
   * 递增
   */
  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  /**
   * 递减
   */
  async decr(key: string): Promise<number> {
    return await this.client.decr(key);
  }

  /**
   * 扫描获取键（推荐用于大数据集）
   */
  async scan(pattern: string = '*', count: number = 100): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, scanKeys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        count,
      );
      keys.push(...scanKeys);
      cursor = nextCursor;
    } while (cursor !== '0');

    return keys;
  }
}
