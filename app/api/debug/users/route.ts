import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/supabaseUserStorage'

export async function GET() {
  try {
    console.log('Debug: Getting all users...')
    const users = await getAllUsers()
    console.log('Debug: Users found:', users.length)
    console.log('Debug: Users data:', users)
    
    return NextResponse.json({
      totalUsers: users.length,
      users: users,
      message: 'Debug users data'
    })
  } catch (error) {
    console.error('Debug users error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      message: error.message
    }, { status: 500 })
  }
}
