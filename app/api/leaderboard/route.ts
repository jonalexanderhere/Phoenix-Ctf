import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        score: true,
        createdAt: true,
        submissions: {
          where: {
            isCorrect: true,
          },
          select: {
            submittedAt: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    })

    // Add rank and solved count to each user
    const leaderboardWithRank = leaderboard.map((user: any, index: number) => ({
      ...user,
      rank: index + 1,
      solvedCount: user.submissions.length,
      lastSolved: user.submissions.length > 0 
        ? user.submissions.reduce((latest: any, submission: any) => 
            submission.submittedAt > latest ? submission.submittedAt : latest, 
            user.submissions[0].submittedAt
          )
        : null,
      submissions: undefined, // Remove submissions from response
    }))

    return NextResponse.json(leaderboardWithRank)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
