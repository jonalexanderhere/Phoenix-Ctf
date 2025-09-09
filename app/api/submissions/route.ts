import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({
        submissions: [],
        totalCount: 0,
        hasMore: false
      })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const challengeId = searchParams.get('challengeId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mock submissions data for production
    const mockSubmissions = [
      {
        id: '1',
        userId: 'admin-prod-001',
        challengeId: '1',
        flag: 'FLAG{web_security_101}',
        isCorrect: true,
        submittedAt: new Date().toISOString(),
        challenge: {
          id: '1',
          title: 'Web Security Challenge',
          category: 'WEB',
          difficulty: 'EASY',
          points: 100
        },
        user: {
          id: 'admin-prod-001',
          name: 'Admin User',
          username: 'admin'
        }
      }
    ]

    // Filter submissions based on parameters
    let filteredSubmissions = mockSubmissions
    
    if (challengeId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.challengeId === challengeId)
    }
    
    if (userId && session.user.role === 'ADMIN') {
      filteredSubmissions = filteredSubmissions.filter(s => s.userId === userId)
    } else {
      filteredSubmissions = filteredSubmissions.filter(s => s.userId === session.user.id)
    }

    // Apply pagination
    const paginatedSubmissions = filteredSubmissions.slice(offset, offset + limit)

    return NextResponse.json({
      submissions: paginatedSubmissions,
      totalCount: filteredSubmissions.length,
      hasMore: offset + paginatedSubmissions.length < filteredSubmissions.length
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
