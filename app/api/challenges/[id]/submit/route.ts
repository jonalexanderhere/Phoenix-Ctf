import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { flag } = body

    if (!flag) {
      return NextResponse.json(
        { error: 'Flag is required' },
        { status: 400 }
      )
    }

    // Get challenge
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: params.id,
        isActive: true,
      },
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Check if user already solved this challenge
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId: params.id,
        },
      },
    })

    if (existingSubmission && existingSubmission.isCorrect) {
      return NextResponse.json(
        { error: 'Challenge already solved' },
        { status: 400 }
      )
    }

    // Check if flag is correct
    const isCorrect = flag === challenge.flag

    // Create or update submission
    await prisma.submission.upsert({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId: params.id,
        },
      },
      update: {
        flag,
        isCorrect,
        submittedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        challengeId: params.id,
        flag,
        isCorrect,
      },
    })

    // If correct, update user score and check for badges
    if (isCorrect && !existingSubmission?.isCorrect) {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          score: {
            increment: challenge.points,
          },
        },
      })

      // Check for new badges
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        await fetch(`${baseUrl}/api/badges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: session.user.id }),
        })
      } catch (error) {
        console.error('Error checking badges:', error)
      }
    }

    return NextResponse.json({
      correct: isCorrect,
      message: isCorrect ? 'Correct flag! Well done!' : 'Incorrect flag. Try again!',
    })
  } catch (error) {
    console.error('Error submitting flag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}