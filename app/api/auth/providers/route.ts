import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return available authentication providers
    const providers = {
      credentials: {
        id: 'credentials',
        name: 'Credentials',
        type: 'credentials',
        signinUrl: '/api/auth/signin/credentials',
        callbackUrl: '/api/auth/callback/credentials'
      }
    }

    return NextResponse.json(providers, { status: 200 })
  } catch (error) {
    console.error('Providers API error:', error)
    return NextResponse.json(
      { error: 'Failed to get providers' },
      { status: 500 }
    )
  }
}
