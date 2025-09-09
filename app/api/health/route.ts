import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check without database dependency
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: 'in-memory',
        type: 'Memory Storage',
        error: null
      },
      auth: 'Simple Cookie-based Auth',
      features: {
        challengeCreation: 'Admin-only',
        userRegistration: 'Available',
        flagSubmission: 'Available',
        leaderboard: 'Real-time'
      }
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}