import { createClient } from 'redis';
import { env } from './env.js';
import { logger } from '../middleware/logger.js';

class RedisClient {
  private client: ReturnType<typeof createClient> | null = null;

  async connect(): Promise<void> {
    this.client = createClient({
      url: env.REDIS_URL,
      socket: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            logger.error('Redis max retries reached');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    this.client.on('error', (err) => {
      logger.error({ error: err }, 'Redis Client Error');
    });

    this.client.on('connect', () => {
      logger.debug('Redis client connected');
    });

    await this.client.connect();
  }

  async quit(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      logger.info('Redis connection closed');
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error('Redis not connected');
    }
    return this.client;
  }

  // Cache helpers
  async get<T>(key: string): Promise<T | null> {
    const value = await this.getClient().get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set(
    key: string,
    value: any,
    expirationSeconds?: number
  ): Promise<void> {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    
    if (expirationSeconds) {
      await this.getClient().setEx(key, expirationSeconds, stringValue);
    } else {
      await this.getClient().set(key, stringValue);
    }
  }

  async del(key: string): Promise<void> {
    await this.getClient().del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.getClient().exists(key);
    return result === 1;
  }
}

export const redisClient = new RedisClient();
