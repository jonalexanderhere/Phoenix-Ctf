import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const error = searchParams.get('error')
    
    // Log the error for debugging
    console.error('Auth error:', error)
    
    // Return a simple error response
    return NextResponse.json(
      { 
        error: error || 'Authentication error',
        message: 'An error occurred during authentication'
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auth error handler error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
