import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Fallback mock data
const mockActivity = {
  recentSubmissions: [
    {
      id: '1',
      challenge: {
        id: '1',
        title: 'Welcome Challenge',
        category: 'MISC',
        difficulty: 'EASY',
        points: 10
      },
      user: {
        id: '1',
        name: 'Admin User',
        username: 'admin'
      },
      submittedAt: new Date().toISOString()
    }
  ],
  recentUsers: [
    {
      id: '1',
      name: 'Admin User',
      username: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Test User',
      username: 'user',
      createdAt: new Date().toISOString()
    }
  ],
  recentScoreChanges: [
    {
      id: '1',
      name: 'Admin User',
      username: 'admin',
      score: 1000,
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Test User',
      username: 'user',
      score: 500,
      updatedAt: new Date().toISOString()
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get recent submissions from all users (for public activity feed)
    const recentSubmissions = await prisma.submission.findMany({
      where: {
        isCorrect: true, // Only show successful submissions
      },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            points: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      },
      take: limit,
    })

    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
    })

    // Get leaderboard changes (users who gained points recently)
    const recentScoreChanges = await prisma.user.findMany({
      where: {
        score: {
          gt: 0
        }
      },
      select: {
        id: true,
        name: true,
        username: true,
        score: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10,
    })

    return NextResponse.json({
      recentSubmissions,
      recentUsers,
      recentScoreChanges,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    console.log('Database error, returning mock data')
    return NextResponse.json({
      ...mockActivity,
      timestamp: new Date().toISOString()
    }, { status: 200 })
  }
}
