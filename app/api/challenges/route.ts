import { NextResponse } from 'next/server'
import { getAllChallenges, createChallenge } from '@/lib/supabaseChallengeStorage'

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
    console.log('Getting challenges from Supabase...')
    
    const challenges = await getAllChallenges()
    console.log('Returning active challenges:', challenges.length)
    
    return NextResponse.json(challenges, { status: 200 })
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
    
    // Create challenge in Supabase
    const challenge = await createChallenge({
      title: body.title,
      description: body.description,
      category: body.category,
      difficulty: body.difficulty,
      points: body.points,
      flag: body.flag,
      hint: body.hint,
      attachment: body.attachment
    })
    
    console.log('Challenge created in Supabase:', challenge.title)
    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    console.error('Create challenge error:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}