import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        submissions: [],
        totalCount: 0,
        hasMore: false
      })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const challengeId = searchParams.get('challengeId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // If userId is provided and user is admin, get submissions for that user
    // Otherwise, get submissions for current user
    const targetUserId = userId && session.user.role === 'ADMIN' ? userId : session.user.id

    const submissions = await prisma.submission.findMany({
      where: {
        userId: targetUserId,
        ...(challengeId && { challengeId }),
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
      skip: offset,
    })

    const totalCount = await prisma.submission.count({
      where: {
        userId: targetUserId,
        ...(challengeId && { challengeId }),
      }
    })

    return NextResponse.json({
      submissions,
      totalCount,
      hasMore: offset + submissions.length < totalCount
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
