import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isProd = process.env.NODE_ENV === "production";
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (isProd && (!redisUrl || !redisToken)) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production for rate limiting."
  );
}

let ratelimit: Ratelimit | null = null;

if (redisUrl && redisToken) {
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "kmg:ratelimit:login",
  });
}

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  retryAfterSeconds?: number;
}> {
  if (!ratelimit) {
    if (isProd) {
      // Fail-closed in production if uninitialized
      return { allowed: false, retryAfterSeconds: 60 };
    }
    console.warn(
      "[RateLimit] Upstash Redis credentials not configured. Skipping rate limit in development."
    );
    return { allowed: true };
  }

  const { remaining, reset } = await ratelimit.getRemaining(ip);

  if (remaining <= 0) {
    const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true };
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  if (!ratelimit) return;
  await ratelimit.limit(ip);
}

export async function clearRateLimit(ip: string): Promise<void> {
  if (!ratelimit) return;
  await ratelimit.resetUsedTokens(ip);
}
