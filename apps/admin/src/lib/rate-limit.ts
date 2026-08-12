// TODO: replace with Upstash Ratelimit or similar shared store before deploying
// to serverless — in-memory state does not persist reliably across serverless
// function instances. This is a dev-appropriate placeholder only.

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const attempts = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = attempts.get(ip);

  // No entry or window expired → allow
  if (!entry || now > entry.resetTime) {
    return { allowed: true };
  }

  // Within window and over limit → block
  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  // Within window but under limit → allow
  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetTime) {
    // Start a new window
    attempts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearRateLimit(ip: string): void {
  attempts.delete(ip);
}
