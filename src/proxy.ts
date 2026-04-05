import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter, that allows 30 requests per 10 seconds
// Will only initialize if the Redis environment variables are present
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(30, '10 s'),
        analytics: true,
      })
    : null;

// Stricter ratelimiter for AI endpoints
const aiRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
        analytics: true,
      })
    : null;

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const path = request.nextUrl.pathname;

  // Rate Limiting Logic
  if (path.startsWith('/api')) {
    if (path.startsWith('/api/ai') && aiRatelimit) {
      const { success, limit, reset, remaining } = await aiRatelimit.limit(`ai_${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: 'AI rate limit exceeded. Please wait a minute.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    } else if (ratelimit) {
      const { success, limit, reset, remaining } = await ratelimit.limit(`api_${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Slow down.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    }
  }

  // Next.js config handles security headers globally
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
