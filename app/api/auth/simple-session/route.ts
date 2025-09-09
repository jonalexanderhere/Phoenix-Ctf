import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('auth-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (parseError) {
      console.error('Session parse error:', parseError)
      // Clear invalid session
      cookieStore.delete('auth-session')
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      // Clear expired session
      cookieStore.delete('auth-session')
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    return NextResponse.json({
      user: sessionData.user,
      expires: sessionData.expires
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
