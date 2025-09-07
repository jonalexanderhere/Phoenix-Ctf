import { NextResponse } from 'next/server'
import { initializeLocalData } from '@/lib/localAuth'

export async function POST() {
  try {
    // Initialize localStorage data
    initializeLocalData()

    return NextResponse.json({
      message: 'LocalStorage seeded successfully',
      admin: {
        email: 'admin@ctf.com',
        username: 'admin',
        password: 'admin123',
      },
      user: {
        email: 'user@ctf.com',
        username: 'user',
        password: 'user123',
      },
    })
  } catch (error) {
    console.error('Error seeding localStorage:', error)
    return NextResponse.json(
      { error: 'Failed to seed localStorage' },
      { status: 500 }
    )
  }
}