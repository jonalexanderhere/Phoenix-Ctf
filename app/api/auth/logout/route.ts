import { NextResponse } from 'next/server'
import { logout } from '@/lib/localAuth'

export async function POST() {
  try {
    logout()
    return NextResponse.json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
