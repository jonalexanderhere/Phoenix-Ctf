import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Callback endpoint active',
    status: 'ok'
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Callback endpoint active',
    status: 'ok'
  })
}
