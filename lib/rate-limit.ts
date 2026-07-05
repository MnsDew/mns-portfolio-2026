import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  retryAfterSec?: number;
}

type MemoryBucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, MemoryBucket>();

const MEMORY_RULES = [
  { suffix: "m", windowMs: 60_000, max: 3 },
  { suffix: "h", windowMs: 3_600_000, max: 10 },
  { suffix: "d", windowMs: 86_400_000, max: 25 },
] as const;

function checkMemoryRateLimit(key: string): RateLimitResult {
  const now = Date.now();

  for (const rule of MEMORY_RULES) {
    const bucketKey = `${key}:${rule.suffix}`;
    const bucket = memoryBuckets.get(bucketKey);

    if (!bucket || now >= bucket.resetAt) {
      memoryBuckets.set(bucketKey, { count: 1, resetAt: now + rule.windowMs });
      continue;
    }

    if (bucket.count >= rule.max) {
      return {
        success: false,
        retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      };
    }

    bucket.count += 1;
  }

  return { success: true };
}

function createUpstashLimiters() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });

  return {
    perMinute: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 m"),
      prefix: "contact:min",
    }),
    perHour: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      prefix: "contact:hour",
    }),
    perDay: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(25, "1 d"),
      prefix: "contact:day",
    }),
  };
}

let upstashLimiters: ReturnType<typeof createUpstashLimiters> | undefined;

function getUpstashLimiters() {
  if (upstashLimiters === undefined) {
    upstashLimiters = createUpstashLimiters();
  }
  return upstashLimiters;
}

async function checkUpstashRateLimit(key: string): Promise<RateLimitResult> {
  const limiters = getUpstashLimiters();
  if (!limiters) return checkMemoryRateLimit(key);

  const checks = await Promise.all([
    limiters.perMinute.limit(key),
    limiters.perHour.limit(key),
    limiters.perDay.limit(key),
  ]);

  const blocked = checks.find((c) => !c.success);
  if (blocked) {
    return {
      success: false,
      retryAfterSec: Math.max(
        1,
        Math.ceil((blocked.reset - Date.now()) / 1000)
      ),
    };
  }

  return { success: true };
}

export function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export async function contactRateLimit(ip: string): Promise<RateLimitResult> {
  const key = `ip:${ip}`;
  return checkUpstashRateLimit(key);
}
