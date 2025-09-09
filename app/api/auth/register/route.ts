import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { addUser, getUserByEmail } from '@/lib/userStorage'

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

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores' },
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in memory
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      username,
      password: hashedPassword,
      role: 'USER',
      score: 0,
      badges: JSON.stringify([]),
      createdAt: new Date().toISOString()
    }

    addUser(newUser)

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
          score: newUser.score,
          badges: [],
          createdAt: newUser.createdAt
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
