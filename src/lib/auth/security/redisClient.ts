import Redis from 'ioredis';

interface MemoryCacheItem {
  value: string;
  expiresAt: number; // ms timestamp
}

// Global store to survive Next.js HMR in development
declare global {
  // eslint-disable-next-line no-var
  var __SELBAR_REDIS_CLIENT__: Redis | null | undefined;
  // eslint-disable-next-line no-var
  var __SELBAR_FALLBACK_CACHE__: Map<string, MemoryCacheItem> | undefined;
}

if (!global.__SELBAR_FALLBACK_CACHE__) {
  global.__SELBAR_FALLBACK_CACHE__ = new Map();
}

const REDIS_URL = process.env.REDIS_URL;
let isRedisConnected = false;
let client: Redis | null = null;

if (REDIS_URL) {
  if (global.__SELBAR_REDIS_CLIENT__) {
    client = global.__SELBAR_REDIS_CLIENT__;
    isRedisConnected = client.status === 'ready' || client.status === 'connect';
  } else {
    try {
      client = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 2,
        connectTimeout: 5000,
        retryStrategy(times) {
          if (times > 3) {
            console.warn('[Redis] Max retries reached, falling back to in-process memory cache.');
            return null; // Stop retrying and fallback
          }
          return Math.min(times * 500, 2000);
        },
        lazyConnect: true,
      });

      client.on('connect', () => {
        isRedisConnected = true;
        console.log('✅ Connected to Redis cache service.');
      });

      client.on('error', (err) => {
        isRedisConnected = false;
        console.warn(`[Redis Notice] Redis connection unavailable (${err.message}). Using resilient local cache.`);
      });

      // Attempt initial connection asynchronously
      client.connect().catch((err) => {
        console.warn(`[Redis Notice] Could not establish initial connection: ${err.message}. Local cache engaged.`);
      });

      global.__SELBAR_REDIS_CLIENT__ = client;
    } catch (e: any) {
      console.warn('[Redis] Failed to initialize Redis client:', e.message);
      client = null;
    }
  }
} else {
  console.info('ℹ️ REDIS_URL not configured. Operating with local high-performance cache.');
}

/**
 * High-Level Resilient Cache Interface
 */
export const cacheStore = {
  /**
   * Set key with TTL in seconds
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (client && isRedisConnected) {
      try {
        if (ttlSeconds) {
          await client.set(key, value, 'EX', ttlSeconds);
        } else {
          await client.set(key, value);
        }
        return;
      } catch {
        // Fall back to memory
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Infinity;
    global.__SELBAR_FALLBACK_CACHE__!.set(key, { value, expiresAt });
  },

  /**
   * Get value for key
   */
  async get(key: string): Promise<string | null> {
    if (client && isRedisConnected) {
      try {
        return await client.get(key);
      } catch {
        // Fall back to memory
      }
    }

    const item = global.__SELBAR_FALLBACK_CACHE__!.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      global.__SELBAR_FALLBACK_CACHE__!.delete(key);
      return null;
    }

    return item.value;
  },

  /**
   * Delete key
   */
  async del(key: string): Promise<number> {
    if (client && isRedisConnected) {
      try {
        return await client.del(key);
      } catch {
        // Fall back to memory
      }
    }

    const existed = global.__SELBAR_FALLBACK_CACHE__!.delete(key);
    return existed ? 1 : 0;
  },

  /**
   * Increment numeric key and set expiration if new
   */
  async incr(key: string, ttlSecondsIfNew = 60): Promise<number> {
    if (client && isRedisConnected) {
      try {
        const val = await client.incr(key);
        if (val === 1 && ttlSecondsIfNew) {
          await client.expire(key, ttlSecondsIfNew);
        }
        return val;
      } catch {
        // Fall back to memory
      }
    }

    const item = global.__SELBAR_FALLBACK_CACHE__!.get(key);
    const now = Date.now();
    if (!item || now > item.expiresAt) {
      global.__SELBAR_FALLBACK_CACHE__!.set(key, {
        value: '1',
        expiresAt: now + ttlSecondsIfNew * 1000,
      });
      return 1;
    }

    const nextVal = parseInt(item.value, 10) + 1;
    item.value = nextVal.toString();
    return nextVal;
  },

  /**
   * Get remaining TTL in seconds
   */
  async ttl(key: string): Promise<number> {
    if (client && isRedisConnected) {
      try {
        return await client.ttl(key);
      } catch {
        // Fall back to memory
      }
    }

    const item = global.__SELBAR_FALLBACK_CACHE__!.get(key);
    if (!item) return -2;
    if (item.expiresAt === Infinity) return -1;
    const remainingMs = item.expiresAt - Date.now();
    if (remainingMs <= 0) {
      global.__SELBAR_FALLBACK_CACHE__!.delete(key);
      return -2;
    }
    return Math.ceil(remainingMs / 1000);
  },

  /**
   * Inspect status
   */
  isRedisActive(): boolean {
    return isRedisConnected;
  },
};

export default cacheStore;
