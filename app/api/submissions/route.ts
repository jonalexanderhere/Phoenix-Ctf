import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserSubmissions } from '@/lib/supabaseSubmissionStorage'

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

    // Get user submissions from Supabase
    let filteredSubmissions = await getUserSubmissions(session.user.id)
    
    if (challengeId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.challenge_id === challengeId)
    }
    
    if (userId && session.user.role === 'ADMIN') {
      filteredSubmissions = await getUserSubmissions(userId)
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