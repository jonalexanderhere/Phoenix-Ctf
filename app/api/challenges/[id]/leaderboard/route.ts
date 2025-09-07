import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const challengeId = params.id

    // Get all correct submissions for this challenge
    const submissions = await prisma.submission.findMany({
      where: {
        challengeId: challengeId,
        isCorrect: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'asc', // First to solve wins
      },
    })

    // Remove duplicates (keep first submission per user)
    const uniqueSubmissions = submissions.reduce((acc: typeof submissions, submission: any) => {
      if (!acc.find((sub: any) => sub.user.id === submission.user.id)) {
        acc.push(submission)
      }
      return acc
    }, [] as typeof submissions)

    // Limit results
    const limitedSubmissions = uniqueSubmissions.slice(0, limit)

    return NextResponse.json(limitedSubmissions)
  } catch (error) {
    console.error('Error fetching challenge leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenge leaderboard' },
      { status: 500 }
    )
  }
}
