import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    csrfToken: 'local-csrf-token',
    message: 'CSRF endpoint active'
  })
}

export async function POST() {
  return NextResponse.json({ 
    csrfToken: 'local-csrf-token',
    message: 'CSRF endpoint active'
  })
}
