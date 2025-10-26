import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(key);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export function middleware(request: NextRequest) {
  // Rate limiting
  const rateLimitKey = getRateLimitKey(request);
  
  if (!checkRateLimit(rateLimitKey)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
      },
    });
  }

  // Security headers for all responses
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Request-ID', crypto.randomUUID());
  
  // Prevent clickjacking
  if (!response.headers.has('X-Frame-Options')) {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }

  // Block pages from being indexed in development
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
