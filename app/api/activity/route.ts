import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
