import { NextResponse } from 'next/server'

export async function GET() {
  // Simple session endpoint that doesn't use database
  return NextResponse.json({ 
    message: 'Session endpoint active',
    status: 'ok'
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Session endpoint active',
    status: 'ok'
  })
}
