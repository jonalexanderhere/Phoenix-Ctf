import { NextRequest, NextResponse } from 'next/server'
import { getUserById, getSubmissionsByUser } from '@/lib/localAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserById(params.id)
    
    if (!user) {
      return NextResponse.json({
        id: params.id,
        name: 'Guest User',
        email: 'guest@example.com',
        username: 'guest',
        score: 0,
        badges: [],
        createdAt: new Date().toISOString(),
        submissions: []
      })
    }

    const submissions = getSubmissionsByUser(params.id)
    
    return NextResponse.json({
      ...user,
      submissions: submissions
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({
      id: params.id,
      name: 'User',
      email: 'user@example.com',
      username: 'user',
      score: 0,
      badges: [],
      createdAt: new Date().toISOString(),
      submissions: []
    })
  }
}