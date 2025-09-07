import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    let databaseStatus = 'unknown'
    let databaseError = null
    
    try {
      await prisma.$queryRaw`SELECT 1`
      databaseStatus = 'connected'
    } catch (error) {
      databaseStatus = 'disconnected'
      databaseError = error instanceof Error ? error.message : 'Unknown database error'
    }

    // Basic health check
    const health = {
      status: databaseStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: databaseStatus,
        type: 'PostgreSQL',
        error: databaseError
      },
      auth: 'NextAuth + Prisma',
      fallback: databaseStatus === 'disconnected' ? 'Mock data available' : null
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: 'Mock data available'
      },
      { status: 500 }
    )
  }
}