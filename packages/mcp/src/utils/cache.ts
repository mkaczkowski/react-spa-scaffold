/**
 * In-memory cache utilities for MCP server.
 */

/** Creates a typed key-value cache with sync and async getOrSet patterns. */
export function createCache<T>() {
  const cache = new Map<string, T>();

  return {
    get: (key: string): T | undefined => cache.get(key),
    set: (key: string, value: T): void => {
      cache.set(key, value);
    },
    has: (key: string): boolean => cache.has(key),
    clear: (): void => cache.clear(),

    /** Gets cached value or computes and caches it (sync). */
    getOrSetSync(key: string, factory: () => T): T {
      const existing = cache.get(key);
      if (existing !== undefined) return existing;
      const value = factory();
      cache.set(key, value);
      return value;
    },

    /** Gets cached value or computes and caches it (async). */
    async getOrSet(key: string, factory: () => Promise<T>): Promise<T> {
      const existing = cache.get(key);
      if (existing !== undefined) return existing;
      const value = await factory();
      cache.set(key, value);
      return value;
    },
  };
}

/** Creates a singleton cache (single value, no key). */
export function createSingletonCache<T>() {
  let cached: T | null = null;

  return {
    get: (): T | null => cached,
    set: (value: T): void => {
      cached = value;
    },
    clear: (): void => {
      cached = null;
    },

    /** Gets cached value or computes (sync). */
    getOrSetSync(factory: () => T): T {
      if (cached !== null) return cached;
      cached = factory();
      return cached;
    },

    /** Gets cached value or computes (async). */
    async getOrSet(factory: () => Promise<T>): Promise<T> {
      if (cached !== null) return cached;
      cached = await factory();
      return cached;
    },
  };
}
