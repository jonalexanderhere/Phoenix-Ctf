import { NextResponse } from 'next/server'

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    score: 1000,
    rank: 1,
    challengesSolved: 5,
    badges: ['First Blood', 'Speed Demon']
  },
  {
    id: '2',
    name: 'Test User',
    username: 'user',
    score: 500,
    rank: 2,
    challengesSolved: 3,
    badges: ['First Blood']
  },
  {
    id: '3',
    name: 'CTF Master',
    username: 'ctf_master',
    score: 750,
    rank: 3,
    challengesSolved: 4,
    badges: ['Speed Demon', 'Persistence']
  }
]

export async function GET() {
  try {
    // Sort by score descending
    const sortedLeaderboard = mockLeaderboard.sort((a, b) => b.score - a.score)
    
    // Update ranks
    const leaderboardWithRanks = sortedLeaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }))
    
    return NextResponse.json(leaderboardWithRanks, { status: 200 })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}