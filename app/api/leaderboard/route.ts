import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/localAuth'

export async function GET() {
  try {
    const leaderboard = getLeaderboard()
    return NextResponse.json(leaderboard, { status: 200 })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}