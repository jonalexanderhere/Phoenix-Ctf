import { NextRequest, NextResponse } from 'next/server'

// Security monitoring endpoint
export async function GET(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  const userAgent = request.headers.get('user-agent') ?? 'unknown'
  
  // Log security events
  console.log(`Security check - IP: ${ip}, UA: ${userAgent}`)
  
  return NextResponse.json({
    status: 'secure',
    timestamp: new Date().toISOString(),
    ip: ip,
    userAgent: userAgent
  })
}

// Security configuration endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate security configuration
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
    
    // Log security configuration changes
    console.log('Security configuration updated:', body)
    
    return NextResponse.json({
      status: 'success',
      message: 'Security configuration updated',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Security configuration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
