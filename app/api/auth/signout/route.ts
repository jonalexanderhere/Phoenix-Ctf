import { NextResponse } from 'next/server'
import { logout } from '@/lib/localAuth'

export async function POST() {
  try {
    logout()
    return NextResponse.json({ message: 'Signout successful' })
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Signout endpoint active',
    status: 'ok'
  })
}
