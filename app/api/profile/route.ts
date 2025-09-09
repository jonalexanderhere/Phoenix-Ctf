import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserById } from '@/lib/supabaseUserStorage'
import { getUserSubmissions } from '@/lib/supabaseSubmissionStorage'

export async function GET() {
  try {
    // Get session from cookies
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('auth-session')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }
    
    // Get user data from Supabase
    const user = await getUserById(sessionData.user.id)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user submissions from Supabase
    const userSubmissions = await getUserSubmissions(sessionData.user.id)
    
    // Calculate stats
    const totalSubmissions = userSubmissions.length
    const solvedChallenges = userSubmissions.filter(s => s.is_correct).length
    const averageScore = totalSubmissions > 0 ? user.score / totalSubmissions : 0

    // Prepare profile data
    const profileData = {
      ...user,
      submissions: userSubmissions.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()),
      stats: {
        totalSubmissions,
        solvedChallenges,
        averageScore: Math.round(averageScore)
      }
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
