import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define allowed origins
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL, // Production URL
  'https://fs-react-454619.web.app', // Firebase hosting URL
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:3000',
    'http://localhost:3001',
  ] : []),
];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Handle CORS for API routes
  if (path.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      
      if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      
      return response;
    }

    // Handle actual requests
    const response = NextResponse.next();

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  }

  // Get the response from the next middleware or route handler
  const response = NextResponse.next();

  // Basic security headers
  response.headers.set('X-Frame-Options', 'DENY'); // Prevents clickjacking attacks
  response.headers.set('X-Content-Type-Options', 'nosniff'); // Prevents MIME type sniffing
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin'); // Controls how much referrer information is sent
  response.headers.set('X-XSS-Protection', '1; mode=block'); // Enables XSS filtering
  
  // Strict Transport Security: Forces HTTPS connections
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Permissions Policy: Controls browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      // Default fallback
      "default-src 'self'",
      
      // Scripts
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://*.stripe.com",
      
      // Styles
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      
      // Images
      "img-src 'self' data: https: blob:",
      
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      
      // Connect (APIs, etc)
      "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.stripe.com",
      
      // Media
      "media-src 'self'",
      
      // Object/embed
      "object-src 'none'",
      
      // Form actions
      "form-action 'self'",
      
      // Frame sources
      "frame-src 'self' https://*.stripe.com",
      
      // Frame ancestors
      "frame-ancestors 'none'",
      
      // Worker scripts
      "worker-src 'self' blob:",
      
      // Manifest
      "manifest-src 'self'",
      
      // Base URI
      "base-uri 'self'"
    ].join('; ')
  );

  return response;
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and _next internal routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 