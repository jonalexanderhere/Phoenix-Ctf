import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/localAuth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, username, password } = body

    // Validate required fields
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = createUser({
      name,
      email,
      username,
      role: 'USER',
      score: 0,
      badges: []
    })

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          score: user.score,
          badges: user.badges,
          createdAt: user.createdAt
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
