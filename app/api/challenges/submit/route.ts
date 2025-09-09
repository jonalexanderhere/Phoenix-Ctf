import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In-memory submissions storage
let submissions: any[] = []

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

    // Get challenge from the challenges array (we need to import it)
    // For now, we'll use a simple check
    const correctFlags: { [key: string]: string } = {
      '1': 'FLAG{web_security_101}',
      '2': 'FLAG{crypto_master}',
      '3': 'FLAG{reverse_engineer}',
      '4': 'FLAG{forensics_expert}',
      '5': 'FLAG{pwn_master}',
      '6': 'FLAG{misc_solver}'
    }

    const correctFlag = correctFlags[challengeId]
    
    if (!correctFlag) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Check if user already solved this challenge
    const existingSubmission = submissions.find(
      s => s.userId === session.user.id && s.challengeId === challengeId && s.isCorrect
    )

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already solved this challenge' },
        { status: 400 }
      )
    }

    const isCorrect = flag === correctFlag

    // Create submission
    const submission = {
      id: `submission-${Date.now()}`,
      userId: session.user.id,
      challengeId,
      flag,
      isCorrect,
      submittedAt: new Date().toISOString()
    }

    submissions.push(submission)

    console.log('Flag submission:', {
      userId: session.user.id,
      challengeId,
      flag: flag.substring(0, 10) + '...',
      isCorrect
    })

    if (isCorrect) {
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
      })
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

    let userSubmissions = submissions.filter(s => s.userId === session.user.id)
    
    if (challengeId) {
      userSubmissions = userSubmissions.filter(s => s.challengeId === challengeId)
    }

    return NextResponse.json({
      submissions: userSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    })
  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
