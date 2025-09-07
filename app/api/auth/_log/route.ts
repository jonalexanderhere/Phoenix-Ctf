import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Log the authentication log data
    console.log('Auth log:', body)
    
    // Return success response
    return NextResponse.json(
      { success: true, message: 'Log recorded' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Auth log error:', error)
    return NextResponse.json(
      { error: 'Failed to log authentication data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return empty log data
    return NextResponse.json(
      { logs: [] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Auth log GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get authentication logs' },
      { status: 500 }
    )
  }
}
