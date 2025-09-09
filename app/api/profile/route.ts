import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/lib/userStorage'

// Global submissions storage
declare global {
  var __submissions: any[] | undefined
}

if (!global.__submissions) {
  global.__submissions = []
}

const submissions = global.__submissions

export async function GET(request: NextRequest) {
  try {
    // For now, return admin profile data
    // TODO: Implement proper session handling
    const userId = 'admin-prod-001'
    
    // Get user data from storage
    const user = getUserById(userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user submissions
    const userSubmissions = submissions.filter(s => s.userId === userId)
    
    // Calculate stats
    const totalSubmissions = userSubmissions.length
    const solvedChallenges = userSubmissions.filter(s => s.isCorrect).length
    const averageScore = totalSubmissions > 0 ? user.score / totalSubmissions : 0

    // Prepare profile data
    const profileData = {
      ...user,
      submissions: userSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
      stats: {
        totalSubmissions,
        solvedChallenges,
        averageScore: Math.round(averageScore)
      }
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
