/**
 * Production-ready rate limiting and trusted client IP resolution.
 * Supports Cloudflare (cf-connecting-ip), Vercel (x-vercel-forwarded-for),
 * Nginx/reverse proxies (x-real-ip), and sanitized X-Forwarded-For parsing.
 */

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 30; // 30 requests per minute

interface RateRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateRecord>();

// Periodic cleanup of stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((value, key) => {
      if (now > value.resetTime) {
        memoryStore.delete(key);
      }
    });
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Validates IPv4 or IPv6 format to prevent header injection or malformed values.
 */
export function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  const ipv4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  const ipv6 = /^[a-fA-F0-9:]{2,39}$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

/**
 * Extracts the most trustworthy client IP address based on hosting edge headers.
 * Avoids trusting arbitrary spoofed client-supplied headers.
 */
export function getTrustedClientIp(req: Request): string {
  // 1. Cloudflare edge header (cryptographically appended by Cloudflare)
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && isValidIp(cfIp.trim())) {
    return cfIp.trim();
  }

  // 2. Vercel edge proxy header
  const vercelIp = req.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const candidate = vercelIp.split(",")[0].trim();
    if (isValidIp(candidate)) {
      return candidate;
    }
  }

  // 3. Reverse proxy X-Real-IP
  const realIp = req.headers.get("x-real-ip");
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  // 4. Standard X-Forwarded-For: sanitize and extract first valid IP
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((s) => s.trim()).filter(Boolean);
    for (const candidate of ips) {
      if (isValidIp(candidate)) {
        return candidate;
      }
    }
  }

  return "127.0.0.1";
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Enforces rate limiting per IP.
 * Defaults to 30 requests/minute.
 */
export function checkRateLimit(
  clientIp: string,
  limit: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(clientIp);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    memoryStore.set(clientIp, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Helper to reset rate limits (useful in testing)
 */
export function clearRateLimits() {
  memoryStore.clear();
}
