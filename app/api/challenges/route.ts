import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Fallback mock data
const mockChallenges = [
  {
    id: '1',
    title: 'Welcome Challenge',
    description: 'This is your first challenge! The flag is hidden somewhere in this description. Look carefully for the pattern: CTF{hello_world}',
    category: 'MISC',
    difficulty: 'EASY',
    points: 10,
    flag: 'CTF{hello_world}',
    hint: 'Look for text in curly braces',
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  },
  {
    id: '2',
    title: 'Base64 Decoder',
    description: 'Decode this base64 string: V2VsY29tZSB0byBvdXIgQ1RGIGNvbXBldGl0aW9uIQ==',
    category: 'CRYPTO',
    difficulty: 'EASY',
    points: 25,
    flag: 'CTF{base64_is_easy}',
    hint: 'Use an online base64 decoder',
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  },
  {
    id: '3',
    title: 'Simple Web Challenge',
    description: 'Visit the URL: http://localhost:3000/web-challenge and find the hidden flag',
    category: 'WEB',
    difficulty: 'MEDIUM',
    points: 50,
    flag: 'CTF{web_exploitation}',
    hint: 'Check the page source',
    attachment: 'http://localhost:3000/web-challenge',
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  }
]

export async function GET() {
  try {
    // Try to get data from database
    const challenges = await prisma.challenge.findMany({
      where: {
        isActive: true
      },
      include: {
        submissions: {
          where: { isCorrect: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // If no challenges found or database error, return mock data
    if (!challenges || challenges.length === 0) {
      console.log('No challenges found in database, returning mock data')
      return NextResponse.json(mockChallenges, { status: 200 })
    }

    return NextResponse.json(challenges, { status: 200 })
  } catch (error) {
    console.error('Challenges API error:', error)
    console.log('Database error, returning mock data')
    return NextResponse.json(mockChallenges, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.difficulty || !body.points || !body.flag) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate points is a number
    if (typeof body.points !== 'number' || body.points <= 0) {
      return NextResponse.json(
        { error: 'Points must be a positive number' },
        { status: 400 }
      )
    }
    
    const challenge = await prisma.challenge.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        points: body.points,
        flag: body.flag,
        hint: body.hint || null,
        attachment: body.attachment || null,
        isActive: true
      }
    })
    
    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    console.error('Create challenge error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Challenge with this title already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}