import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { filter, map, Observable, Subject } from 'rxjs';

type PubSubEnvelope = {
  channel: string;
  message: string;
};

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisPubSubService.name);
  private readonly bus$ = new Subject<PubSubEnvelope>();
  private readonly localCache = new Map<
    string,
    { expiresAt: number; value: string }
  >();
  private readonly subscribedChannels = new Set<string>();
  private publisher: Redis | null = null;
  private subscriber: Redis | null = null;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      this.logger.warn('REDIS_URL not configured. Falling back to in-process events.');
      return;
    }

    const password = process.env.REDIS_PASSWORD || undefined;

    this.publisher = new Redis(redisUrl, {
      password,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    this.subscriber = new Redis(redisUrl, {
      password,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });

    this.subscriber.on('message', (channel, message) => {
      this.bus$.next({ channel, message });
    });

    try {
      await Promise.all([this.publisher.connect(), this.subscriber.connect()]);
    } catch (error) {
      this.logger.warn(
        `Redis Pub/Sub unavailable. Falling back to in-process events. ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      await this.onModuleDestroy();
    }
  }

  async onModuleDestroy() {
    await Promise.allSettled([this.publisher?.quit(), this.subscriber?.quit()]);
    this.publisher = null;
    this.subscriber = null;
  }

  async publish(channel: string, payload: unknown) {
    const message = JSON.stringify(payload);

    if (!this.publisher) {
      this.bus$.next({ channel, message });
      return;
    }

    try {
      await this.publisher.publish(channel, message);
    } catch (error) {
      this.logger.warn(
        `Redis publish failed for ${channel}. Falling back to in-process event. ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      this.bus$.next({ channel, message });
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = this.publisher
      ? await this.publisher.get(key)
      : this.getLocalCache(key);

    return value ? (JSON.parse(value) as T) : null;
  }

  async setJson(key: string, payload: unknown, ttlSeconds: number) {
    const value = JSON.stringify(payload);

    if (this.publisher) {
      await this.publisher.set(key, value, 'EX', ttlSeconds);
      return;
    }

    this.localCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async deleteCache(key: string) {
    if (this.publisher) {
      await this.publisher.del(key);
      return;
    }

    this.localCache.delete(key);
  }

  async subscribe<T>(channel: string): Promise<Observable<T>> {
    if (this.subscriber && !this.subscribedChannels.has(channel)) {
      await this.subscriber.subscribe(channel);
      this.subscribedChannels.add(channel);
    }

    return this.bus$.pipe(
      filter((event) => event.channel === channel),
      map((event) => JSON.parse(event.message) as T),
    );
  }

  private getLocalCache(key: string) {
    const entry = this.localCache.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.localCache.delete(key);
      return null;
    }

    return entry.value;
  }
}
