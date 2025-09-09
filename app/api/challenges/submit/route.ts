import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateUserScore } from '@/lib/supabaseUserStorage'
import { createSubmission, checkExistingSubmission } from '@/lib/supabaseSubmissionStorage'
import { getChallengeById } from '@/lib/supabaseChallengeStorage'

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
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { challengeId, flag } = body

    if (!challengeId || !flag) {
      return NextResponse.json(
        { error: 'Challenge ID and flag are required' },
        { status: 400 }
      )
    }

    // Get challenge from Supabase
    const challenge = await getChallengeById(challengeId)
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    const correctFlag = challenge.flag

    // Check if user already solved this challenge
    const existingSubmission = await checkExistingSubmission(session.user.id, challengeId)

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already solved this challenge' },
        { status: 200 }
      )
    }

    const isCorrect = flag === correctFlag

    // Create submission in Supabase
    const submission = await createSubmission({
      user_id: session.user.id,
      challenge_id: challengeId,
      flag,
      is_correct: isCorrect
    })

    console.log('Flag submission:', {
      userId: session.user.id,
      challengeId,
      flag: flag.substring(0, 10) + '...',
      isCorrect
    })

    if (isCorrect) {
      // Update user score in Supabase
      await updateUserScore(session.user.id, challenge.points)
      
      return NextResponse.json({
        success: true,
        message: 'Congratulations! You solved the challenge!',
        submission
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Incorrect flag. Try again!',
        submission
      }, { status: 200 })
    }
  } catch (error) {
    console.error('Submit flag error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const challengeId = searchParams.get('challengeId')

    // Get user submissions from Supabase
    const { getUserSubmissions } = await import('@/lib/supabaseSubmissionStorage')
    let userSubmissions = await getUserSubmissions(session.user.id)
    
    if (challengeId) {
      userSubmissions = userSubmissions.filter(s => s.challenge_id === challengeId)
    }

    return NextResponse.json({
      submissions: userSubmissions.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    })
  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}