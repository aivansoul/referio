export interface RateLimitBucket { count: number; windowStartedAt: number; blockedUntil?: number }
export interface RateLimitPolicy { limit: number; windowMs: number; blockMs: number }

export function consumeRateLimit(bucket: RateLimitBucket | undefined, policy: RateLimitPolicy, now: number): RateLimitBucket {
  if (bucket?.blockedUntil && bucket.blockedUntil > now) throw new RateLimitError(bucket.blockedUntil);
  const current = !bucket || now - bucket.windowStartedAt >= policy.windowMs ? { count: 0, windowStartedAt: now } : bucket;
  const next = { ...current, count: current.count + 1 };
  if (next.count > policy.limit) {
    const blockedUntil = now + policy.blockMs;
    throw new RateLimitError(blockedUntil);
  }
  return next;
}

export class RateLimitError extends Error {
  constructor(public readonly retryAt: number) { super("Trop de tentatives"); this.name = "RateLimitError"; }
}
