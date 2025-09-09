import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/lib/userStorage'

export async function POST(request: NextRequest) {
  try {
    console.log('Test simple login API called')
    
    const body = await request.json()
    const { email, password } = body

    console.log('Test login for:', email)
    console.log('Request body received:', { email, password: password ? '***' : 'missing' })

    // Find user in shared storage
    const user = getUserByEmail(email)

    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('User found:', user.email, 'Role:', user.role)

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('Password valid for user:', email)

    // Create session data
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        score: user.score,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    // Set session cookie
    try {
      const cookieStore = cookies()
      cookieStore.set('auth-session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: false, // false for localhost
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/'
      })
    } catch (cookieError) {
      console.error('Cookie setting error:', cookieError)
    }

    const response = {
      success: true,
      user: sessionData.user,
      message: 'Login successful'
    }
    
    console.log('Returning successful response:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Test simple login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
