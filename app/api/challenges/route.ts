import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Add cache headers to reduce server load
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    
    const challenges = await prisma.challenge.findMany({
      where: {
        isActive: true,
      },
      include: {
        submissions: session ? {
          where: {
            userId: session.user.id,
          },
        } : false,
      },
      orderBy: [
        { category: 'asc' },
        { difficulty: 'asc' },
        { points: 'asc' },
      ],
    })

    // Transform data to include solved status
    const challengesWithStatus = challenges.map((challenge: any) => ({
      ...challenge,
      isSolved: session ? challenge.submissions.some((sub: any) => sub.isCorrect) : false,
      submissions: undefined, // Remove submissions from response
    }))

    return NextResponse.json(challengesWithStatus, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
      }
    })
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Retry-After': '30'
        }
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, category, difficulty, points, flag, hint, attachment } = body

    // Validate required fields
    if (!title || !description || !category || !difficulty || !points || !flag) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['WEB', 'CRYPTO', 'FORENSICS', 'REVERSE', 'PWN', 'MISC']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate difficulty
    const validDifficulties = ['EASY', 'MEDIUM', 'HARD']
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty' },
        { status: 400 }
      )
    }

    // Validate points
    if (points < 1 || points > 1000) {
      return NextResponse.json(
        { error: 'Points must be between 1 and 1000' },
        { status: 400 }
      )
    }

    const challenge = await prisma.challenge.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        points: parseInt(points),
        flag: flag.trim(),
        hint: hint?.trim() || null,
        attachment: attachment?.trim() || null,
      },
    })

    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
