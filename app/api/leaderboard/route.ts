import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        score: true,
        badges: true,
        submissions: {
          where: { isCorrect: true },
          select: {
            challengeId: true,
            submittedAt: true
          }
        }
      },
      orderBy: {
        score: 'desc'
      }
    })

    const leaderboard = users.map((user, index) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      score: user.score || 0,
      rank: index + 1,
      challengesSolved: user.submissions.length,
      badges: user.badges ? JSON.parse(user.badges) : []
    }))

    return NextResponse.json(leaderboard, { status: 200 })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: 'Invalid badge data format' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}