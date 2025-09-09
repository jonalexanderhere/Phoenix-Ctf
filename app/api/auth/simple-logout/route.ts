import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    try {
      cookieStore.delete('auth-session')
    } catch (deleteError) {
      console.error('Cookie delete error:', deleteError)
    }

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    // Even if cookie deletion fails, we should return success
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    })
  }
}
