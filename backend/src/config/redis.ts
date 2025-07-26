import { createClient } from 'redis';
import { logger } from '@/utils/logger';

const client = createClient({
  url: process.env['REDIS_URL'] || 'redis://localhost:6379'
});

export async function connectRedis(): Promise<void> {
  try {
    await client.connect();
    logger.info('Redis connection established');
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
}

export async function getRedisClient() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

export async function set(key: string, value: string, ttl?: number): Promise<void> {
  try {
    if (ttl) {
      await client.setEx(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  } catch (error) {
    logger.error('Redis set error:', error);
    throw error;
  }
}

export async function get(key: string): Promise<string | null> {
  try {
    return await client.get(key);
  } catch (error) {
    logger.error('Redis get error:', error);
    throw error;
  }
}

export async function del(key: string): Promise<void> {
  try {
    await client.del(key);
  } catch (error) {
    logger.error('Redis del error:', error);
    throw error;
  }
}

export default client; 