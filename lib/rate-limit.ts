// Small in-memory rate limiter for the login route. It's best-effort: on
// serverless each instance has its own map and it resets on cold starts, but it
// still stops someone hammering passwords from one machine. For anything bigger
// you'd move this to Redis / Upstash.

type Hit = { count: number; resetAt: number };

const hits = new Map<string, Hit>();

type Result = { ok: boolean; retryAfter: number };

export function rateLimit(key: string, limit: number, windowMs: number): Result {
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  current.count += 1;
  if (current.count > limit) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

// Pull the client ip from the platform's forwarded header. On Vercel this is set
// by the edge and the first entry is the real client.
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Drop stale buckets now and then so the map doesn't grow forever.
export function sweep() {
  const now = Date.now();
  for (const [key, hit] of hits) {
    if (hit.resetAt < now) hits.delete(key);
  }
}
