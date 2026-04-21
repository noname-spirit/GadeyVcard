// In-memory rate limiter for auth endpoints
// Limits requests per IP address within a sliding window

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now > entry.resetAt) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Check rate limit for a given key (typically IP address).
 * @param key - Identifier (IP address)
 * @param maxAttempts - Max requests allowed in the window (default: 5)
 * @param windowMs - Time window in milliseconds (default: 15 minutes)
 * @returns { allowed: boolean, remaining: number, retryAfterMs: number }
 */
export function checkRateLimit(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
        // New window
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: maxAttempts - 1, retryAfterMs: 0 };
    }

    if (entry.count >= maxAttempts) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: entry.resetAt - now,
        };
    }

    entry.count++;
    return { allowed: true, remaining: maxAttempts - entry.count, retryAfterMs: 0 };
}

/**
 * Get client IP from request headers.
 */
export function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const real = req.headers.get('x-real-ip');
    if (real) return real;
    return 'unknown';
}
