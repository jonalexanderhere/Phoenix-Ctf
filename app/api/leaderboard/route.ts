import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/userStorage'

// Global submissions storage for counting solved challenges
declare global {
  var __submissions: any[] | undefined
}

if (!global.__submissions) {
  global.__submissions = []
}

const submissions = global.__submissions

export async function GET() {
  try {
    // Get all users from shared storage
    const users = getAllUsers()
    
    // Count solved challenges for each user
    const leaderboard = users.map((user, index) => {
      const solvedChallenges = submissions.filter(
        s => s.userId === user.id && s.isCorrect
      ).length
      
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        score: user.score,
        rank: index + 1,
        challengesSolved: solvedChallenges,
        badges: user.badges ? JSON.parse(user.badges) : []
      }
    }).sort((a, b) => b.score - a.score) // Sort by score descending

    // Update ranks after sorting
    leaderboard.forEach((user, index) => {
      user.rank = index + 1
    })

    console.log('Leaderboard data:', leaderboard)
    return NextResponse.json(leaderboard, { status: 200 })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}