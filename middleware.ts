import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimiter, getRateLimitConfig, createRateLimitResponse } from '@/lib/rateLimiter'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  
  // Ensure TypeScript pages are served correctly
  // Don't interfere with Next.js routing
  if (pathname === '/' || pathname.startsWith('/challenges') || 
      pathname.startsWith('/profile') || pathname.startsWith('/leaderboard') ||
      pathname.startsWith('/admin') || pathname.startsWith('/auth') ||
      pathname.startsWith('/web-challenge')) {
    // Let Next.js handle these routes
    const response = NextResponse.next()
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  }
  
  // Security headers
  const response = NextResponse.next()
  
  // Enhanced security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';")
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
  
  // Cache static assets
  if (pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // API rate limiting with improved logic
  if (pathname.startsWith('/api/')) {
    const config = getRateLimitConfig('api')
    const result = rateLimiter.isAllowed(ip, config)
    
    if (!result.allowed) {
      return createRateLimitResponse(result.resetTime)
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
  }
  
  // Stricter rate limiting for auth endpoints
  if (pathname.startsWith('/api/auth/')) {
    const config = getRateLimitConfig('auth')
    const result = rateLimiter.isAllowed(ip, config)
    
    if (!result.allowed) {
      return createRateLimitResponse(result.resetTime)
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
  }
  
  // Rate limiting for challenge submissions
  if (pathname.startsWith('/api/challenges/') && pathname.includes('/submit')) {
    const config = getRateLimitConfig('submission')
    const result = rateLimiter.isAllowed(ip, config)
    
    if (!result.allowed) {
      return createRateLimitResponse(result.resetTime)
    }
  }
  
  // Block suspicious requests
  const userAgent = request.headers.get('user-agent') || ''
  if (userAgent.includes('bot') && !userAgent.includes('Googlebot')) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  
  // Block common attack patterns
  if (pathname.includes('..') || pathname.includes('//')) {
    return new NextResponse('Bad Request', { status: 400 })
  }
  
  return response
}

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
}
