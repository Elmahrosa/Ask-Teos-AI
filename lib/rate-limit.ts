// TEOS AI — minimal in-memory rate limiter (fixed window per key).
//
// Limitation (documented, accepted for milestone 1): state is per-process and
// resets on deploy/restart; it is not a distributed limiter. It exists to blunt
// accidental and trivial abuse, not to replace an edge/WAF rate limit.

export interface RateLimitResult {
  ok: boolean
  /** Seconds until the window resets (0 when allowed). */
  retryAfterS: number
  remaining: number
}

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function rateLimit(
  key: string,
  limit: number,
  windowMs = 60_000,
  now = Date.now()
): RateLimitResult {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12
  const existing = buckets.get(key)

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterS: 0, remaining: safeLimit - 1 }
  }

  if (existing.count >= safeLimit) {
    const retryAfterS = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    return { ok: false, retryAfterS, remaining: 0 }
  }

  existing.count += 1
  return { ok: true, retryAfterS: 0, remaining: safeLimit - existing.count }
}

/** Test hook: clear all buckets. */
export function resetRateLimiter(): void {
  buckets.clear()
}