import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis.Redis;

  private subscriber?: Redis.Redis;

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
   * 存储 JSON 对象
   */
  async setJson<T>(key: string, value: T, exSecond?: number): Promise<void> {
    const jsonStr = JSON.stringify(value);
    await this.set(key, jsonStr, exSecond);
  }

  /**
   * 获取 JSON 对象
   */
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
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

  // ------------- Set 操作
  async sadd(key: string, ...members: Array<string | number>): Promise<number> {
    return await this.client.sadd(key, ...members.map(String));
  }

  async srem(key: string, ...members: Array<string | number>): Promise<number> {
    return await this.client.srem(key, ...members.map(String));
  }

  async sismember(key: string, member: string | number): Promise<boolean> {
    return (await this.client.sismember(key, String(member))) === 1;
  }

  async smembers(key: string): Promise<string[]> {
    return await this.client.smembers(key);
  }

  /**
   * Set 中添加对象
   */
  async saddJson(key: string, ...members: any[]): Promise<number> {
    const strMembers = members.map((m) => JSON.stringify(m));
    return await this.client.sadd(key, ...strMembers);
  }

  /**
   * 获取 Set 中的对象
   */
  async smembersJson<T>(key: string): Promise<T[]> {
    const members = await this.client.smembers(key);
    return members.map((m) => JSON.parse(m));
  }

  // ------------ Hash 操作
  async hset(
    key: string,
    fieldOrMap: string | Record<string, any>,
    value?: string | number,
  ): Promise<number> {
    if (typeof fieldOrMap === 'object') {
      const args = Object.entries(fieldOrMap).flatMap(([f, v]) => [
        f,
        String(v),
      ]);
      return await this.client.hset(key, ...args);
    } else {
      return await this.client.hset(key, fieldOrMap, String(value));
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    return await this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return await this.client.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return await this.client.hdel(key, ...fields);
  }

  async hexists(key: string, field: string): Promise<boolean> {
    return (await this.client.hexists(key, field)) === 1;
  }

  // ----------- Sorted Set
  async zadd(
    key: string,
    members: Array<{ score: number; member: string }>,
  ): Promise<number> {
    const args = members.flatMap((m) => [String(m.score), m.member]);
    return await this.client.zadd(key, ...args);
  }

  async zrange(
    key: string,
    start = 0,
    stop = -1,
    withScores = false,
  ): Promise<string[] | Array<{ member: string; score: number }>> {
    if (!withScores) {
      return await this.client.zrange(key, start, stop);
    }
    const res = await this.client.zrange(key, start, stop, 'WITHSCORES');
    const out: Array<{ member: string; score: number }> = [];
    for (let i = 0; i < res.length; i += 2) {
      out.push({ member: res[i], score: Number(res[i + 1]) });
    }
    return out;
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    return await this.client.zrem(key, ...members);
  }

  async zscore(key: string, member: string): Promise<number | null> {
    const s = await this.client.zscore(key, member);
    return s === null ? null : Number(s);
  }

  // -----------------------
  // Pub/Sub（订阅使用独立连接）
  // -----------------------
  async publish(channel: string, message: string): Promise<number> {
    return await this.client.publish(channel, message);
  }

  async subscribe(
    channel: string,
    handler: (channel: string, message: string) => void,
  ): Promise<void> {
    if (!this.subscriber) {
      // 使用与主连接相同配置创建独立订阅连接
      this.subscriber = new Redis.Redis({
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: this.configService.get('REDIS_PORT', 6379),
        password: this.configService.get('REDIS_PASSWORD'),
        db: this.configService.get('REDIS_DB', 0),
      });
      this.subscriber.on('message', (ch: string, message: string) => {
        handler(ch, message);
      });
    }
    await this.subscriber.subscribe(channel);
  }

  async unsubscribe(channel: string): Promise<void> {
    if (!this.subscriber) return;
    await this.subscriber.unsubscribe(channel);
  }
}
