import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/supabaseUserStorage'
import { getAllSubmissions } from '@/lib/supabaseSubmissionStorage'

export async function GET() {
  try {
    // Get all users from Supabase
    const users = await getAllUsers()
    
    // Get all submissions from Supabase
    const submissions = await getAllSubmissions()
    
    // Count solved challenges for each user
    const leaderboard = users.map((user, index) => {
      const solvedChallenges = submissions.filter(
        s => s.user_id === user.id && s.is_correct
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

    console.log('Leaderboard data from Supabase:', leaderboard)
    return NextResponse.json(leaderboard, { status: 200 })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}