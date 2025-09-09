import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('Test simple login API called')
    
    const body = await request.json()
    const { email, password } = body

    console.log('Test login for:', email)
    console.log('Request body received:', { email, password: password ? '***' : 'missing' })

    // Hardcoded admin user for testing
    if (email === 'admin@ctf.com' && password === 'admin123') {
      const sessionData = {
        user: {
          id: 'admin-prod-001',
          email: 'admin@ctf.com',
          name: 'Admin User',
          username: 'admin',
          role: 'ADMIN',
          score: 1000,
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
    } else {
      console.log('Invalid credentials')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error) {
    console.error('Test simple login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
