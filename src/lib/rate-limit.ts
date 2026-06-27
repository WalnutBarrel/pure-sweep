export class RateLimiter {
  private cache = new Map<string, { count: number; timestamp: number }>();

  constructor(private limit: number, private windowMs: number) {}

  check(ip: string): boolean {
    const now = Date.now();
    const record = this.cache.get(ip);

    if (record) {
      if (now - record.timestamp < this.windowMs) {
        if (record.count >= this.limit) {
          return false; // Rate limit exceeded
        }
        record.count += 1;
        this.cache.set(ip, record);
        return true;
      }
    }

    // New record or window expired
    this.cache.set(ip, { count: 1, timestamp: now });
    return true;
  }
}

// 5 attempts per 15 minutes for login
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

// 10 attempts per hour for bookings/contact
export const formRateLimiter = new RateLimiter(10, 60 * 60 * 1000);
