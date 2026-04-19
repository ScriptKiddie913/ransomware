const WINDOW_MS = 60_000;
const LIMIT = 120;

const BUCKET = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = BUCKET.get(key);

  if (!current || now > current.resetAt) {
    BUCKET.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (current.count >= LIMIT) return true;
  current.count += 1;
  return false;
}
