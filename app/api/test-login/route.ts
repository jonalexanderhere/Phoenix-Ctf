import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Test login for:', email)

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('User found:', user.email, 'Role:', user.role)
    console.log('Stored password hash:', user.password.substring(0, 20) + '...')

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email)
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        score: user.score || 0,
      }
    })
  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
