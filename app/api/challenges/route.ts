import { NextResponse } from 'next/server'

// Mock challenges data
const mockChallenges = [
  {
    id: '1',
    title: 'Welcome Challenge',
    description: 'A simple challenge to get you started with PHX CTF platform.',
    category: 'Web',
    difficulty: 'Easy',
    points: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  },
  {
    id: '2',
    title: 'Basic SQL Injection',
    description: 'Find the flag by exploiting a basic SQL injection vulnerability.',
    category: 'Web',
    difficulty: 'Medium',
    points: 200,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  },
  {
    id: '3',
    title: 'Caesar Cipher',
    description: 'Decode the message using Caesar cipher technique.',
    category: 'Cryptography',
    difficulty: 'Easy',
    points: 150,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  }
]

export async function GET() {
  try {
    return NextResponse.json(mockChallenges, { status: 200 })
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
    
    // Mock challenge creation
    const newChallenge = {
      id: (mockChallenges.length + 1).toString(),
      ...body,
      isActive: true,
      createdAt: new Date().toISOString(),
      submissions: []
    }
    
    mockChallenges.push(newChallenge)
    
    return NextResponse.json(newChallenge, { status: 201 })
  } catch (error) {
    console.error('Create challenge error:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}