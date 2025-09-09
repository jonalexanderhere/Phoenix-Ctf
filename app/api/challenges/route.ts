import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Global challenge storage
declare global {
  var __challenges: any[] | undefined
}

if (!global.__challenges) {
  global.__challenges = []
}

const challenges = global.__challenges

async function getSession() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('auth-session')
    
    if (!sessionCookie) {
      return null
    }
    
    const sessionData = JSON.parse(sessionCookie.value)
    
    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      return null
    }
    
    return sessionData
  } catch (error) {
    console.error('Session check error:', error)
    return null
  }
}

export async function GET() {
  try {
    console.log('Getting challenges, current count:', challenges.length)
    
    // Return challenges sorted by creation date (newest first)
    const sortedChallenges = challenges
      .filter(c => c.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(sortedChallenges, { status: 200 })
  } catch (error) {
    console.error('Challenges API error:', error)
    return NextResponse.json([], { status: 200 })
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