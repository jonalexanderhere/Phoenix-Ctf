import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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

    const challenge = await prisma.challenge.findUnique({
      where: {
        id: params.id,
        isActive: true,
      },
      include: {
        submissions: {
          where: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    const isSolved = challenge.submissions.some((sub: any) => sub.isCorrect)

    return NextResponse.json({
      ...challenge,
      isSolved,
      submissions: undefined, // Remove submissions from response
    })
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, category, difficulty, points, flag, hint, attachment, isActive } = body

    const challenge = await prisma.challenge.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        category,
        difficulty,
        points,
        flag,
        hint,
        attachment,
        isActive,
      },
    })

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error updating challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if challenge exists first
    const existingChallenge = await prisma.challenge.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingChallenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Delete related submissions first (if any)
    await prisma.submission.deleteMany({
      where: {
        challengeId: params.id,
      },
    })

    // Then delete the challenge
    await prisma.challenge.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Challenge deleted successfully' })
  } catch (error) {
    console.error('Error deleting challenge:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('P2025')) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
