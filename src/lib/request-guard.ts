/**
 * Cheap, dependency-free guards for public POST endpoints.
 *
 * Neither is a wall. The rate limit lives in one serverless instance's memory,
 * so a determined sender spread across instances gets through; what it stops
 * is the common case — a script hammering one warm function, or a visitor
 * double-submitting — without a database or a paid service in the path.
 */

/** Fixed-window counter per key. Returns false once `limit` is exceeded. */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5000,
}: {
  limit: number;
  windowMs: number;
  maxKeys?: number;
}) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function allow(key: string, now = Date.now()): boolean {
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      // Bound memory: drop expired entries, then the oldest, before adding.
      if (hits.size >= maxKeys) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
        if (hits.size >= maxKeys) hits.delete(hits.keys().next().value as string);
      }
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

/** The caller's address as Vercel reports it, or a shared bucket if unknown. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * True when a browser request came from a page on this same host. Requests
 * with no Origin header (curl, server-to-server) are allowed — this stops
 * other websites posting through a visitor's browser, not API clients.
 */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return true;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
