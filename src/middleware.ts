import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Defense-in-Depth Route Protection (Guards for Admin, Seller, and Account)
  const isProtectedAdmin = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isProtectedSeller = pathname.startsWith('/seller') && !pathname.startsWith('/seller/login');
  const isProtectedAccount = pathname.startsWith('/account');

  const refreshToken = request.cookies.get('selbar_refresh_token')?.value;
  const accessToken = request.cookies.get('selbar_access_token')?.value;
  const hasAuthSession = Boolean(refreshToken || accessToken);

  if ((isProtectedAdmin || isProtectedSeller || isProtectedAccount) && !hasAuthSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Clone response and attach Security Headers
  const response = NextResponse.next();

  // Protect against Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME-sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Strict Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict sensitive browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self "https://checkout.razorpay.com")'
  );

  // Strict-Transport-Security (HSTS) in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Content-Security-Policy (CSP) configured for Next.js, Google Fonts, and Razorpay
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://images.unsplash.com https://cdn.jsdelivr.net;
    font-src 'self' https://fonts.gstatic.com data:;
    connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com;
    frame-src 'self' https://api.razorpay.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
