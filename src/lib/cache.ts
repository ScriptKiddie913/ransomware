type CacheItem<T> = {
  value: T;
  expiresAt: number;
};

const CACHE = new Map<string, CacheItem<unknown>>();

export function getCache<T>(key: string): T | null {
  const item = CACHE.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    CACHE.delete(key);
    return null;
  }
  return item.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs: number) {
  CACHE.set(key, { value, expiresAt: Date.now() + ttlMs });
}
