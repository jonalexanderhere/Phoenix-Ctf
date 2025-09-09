import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('Simple login API called')
    
    const body = await request.json()
    const { email, password } = body

    console.log('Simple login for:', email)
    console.log('Request body received:', { email, password: password ? '***' : 'missing' })

    // Check if we're in production and handle accordingly
    const isProduction = process.env.NODE_ENV === 'production'
    console.log('Environment:', process.env.NODE_ENV, 'Is production:', isProduction)

    // For both production and development, use hardcoded admin credentials
    // This ensures the app works regardless of database availability
    if (email === 'admin@ctf.com' && password === 'admin123') {
      const sessionData = {
        user: {
          id: isProduction ? 'admin-prod-001' : 'admin-dev-001',
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
          secure: isProduction, // true for production, false for localhost
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
    console.error('Simple login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}