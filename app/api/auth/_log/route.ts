import { NextResponse } from 'next/server'

export async function POST() {
  // Simple log endpoint that doesn't use database
  return NextResponse.json({ message: 'Log recorded' })
}

export async function GET() {
  return NextResponse.json({ message: 'Log endpoint active' })
}