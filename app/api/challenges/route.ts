import { NextResponse } from 'next/server'
import { getChallenges, createChallenge } from '@/lib/localAuth'

export async function GET() {
  try {
    const challenges = getChallenges().filter(challenge => challenge.isActive)
    return NextResponse.json(challenges, { status: 200 })
  } catch (error) {
    console.error('Challenges API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
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
    
    const challenge = createChallenge({
      title: body.title,
      description: body.description,
      category: body.category,
      difficulty: body.difficulty,
      points: body.points,
      flag: body.flag,
      hint: body.hint || undefined,
      attachment: body.attachment || undefined,
      isActive: true
    })
    
    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    console.error('Create challenge error:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}