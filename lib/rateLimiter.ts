// Rate limiter utility for better request management
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitEntry {
  count: number
  resetTime: number
  lastRequest: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    this.store.forEach((entry, key) => {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    })
  }

  isAllowed(
    identifier: string, 
    config: RateLimitConfig
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = identifier
    const entry = this.store.get(key)

    // If no entry or window expired, create new entry
    if (!entry || now > entry.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
        lastRequest: now
      })
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      }
    }

    // Check if within rate limit
    if (entry.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    // Increment counter
    entry.count++
    entry.lastRequest = now

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter()

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // General API requests
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },
  
  // Authentication requests
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },
  
  // Development mode (more lenient)
  dev: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },
  
  // Challenge submissions
  submission: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  }
}

// Helper function to get rate limit config based on environment
export function getRateLimitConfig(type: keyof typeof rateLimitConfigs) {
  const isDev = process.env.NODE_ENV === 'development'
  const config = rateLimitConfigs[type]
  
  if (isDev && type === 'api') {
    return rateLimitConfigs.dev
  }
  
  return config
}

// Helper function to create rate limit response
export function createRateLimitResponse(resetTime: number) {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)
  
  return new Response('Too Many Requests', {
    status: 429,
    headers: {
      'Retry-After': retryAfter.toString(),
      'X-RateLimit-Limit': '200',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': resetTime.toString(),
      'Content-Type': 'text/plain'
    }
  })
}
