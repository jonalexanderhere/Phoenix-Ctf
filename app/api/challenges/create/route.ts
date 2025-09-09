import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(request: NextRequest) {
  try {
    // For testing, skip session check
    // const session = await getSession()
    
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    
    // if (session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    // }

    const body = await request.json()
    const { title, description, category, difficulty, points, flag, hint, attachment } = body

    // Validate required fields
    if (!title || !description || !category || !difficulty || !points || !flag) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate points is a number
    if (typeof points !== 'number' || points <= 0) {
      return NextResponse.json(
        { error: 'Points must be a positive number' },
        { status: 400 }
      )
    }

    // Create new challenge
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      title,
      description,
      category,
      difficulty,
      points,
      flag,
      hint: hint || null,
      attachment: attachment || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissions: []
    }

    challenges.push(newChallenge)

    console.log('Challenge created:', newChallenge)

    return NextResponse.json({
      message: 'Challenge created successfully',
      challenge: newChallenge
    }, { status: 201 })
  } catch (error) {
    console.error('Create challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json({
      challenges: challenges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    })
  } catch (error) {
    console.error('Get challenges error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
