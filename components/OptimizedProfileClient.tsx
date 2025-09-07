'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

interface UserData {
  id: string
  name: string | null
  email: string
  username: string
  score: number
  badges: string
  createdAt: string
  submissions: any[]
  role?: string
}

interface OptimizedProfileClientProps {
  userData: UserData
  userId: string
}

export default function OptimizedProfileClient({ userData }: OptimizedProfileClientProps) {
  const { status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    solvedChallenges: 0,
    averageScore: 0
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Calculate stats
    const totalSubmissions = userData.submissions?.length || 0
    const solvedChallenges = userData.submissions?.filter(s => s.isCorrect).length || 0
    const averageScore = totalSubmissions > 0 ? userData.score / totalSubmissions : 0
    
    setStats({
      totalSubmissions,
      solvedChallenges,
      averageScore: Math.round(averageScore)
    })
  }, [status, router, userData])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    )
  }

  const badges = userData.badges ? JSON.parse(userData.badges) : []

  return (
    <div className="space-y-8">
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData.name?.charAt(0)?.toUpperCase() || userData.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {userData.name || userData.username}
            </h2>
            <p className="text-gray-600">@{userData.username}</p>
            <p className="text-sm text-gray-500">{userData.email}</p>
            {userData.role === 'ADMIN' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                🔧 Administrator
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{userData.score}</div>
            <div className="text-sm text-gray-500">Total Points</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.totalSubmissions}</div>
          <div className="text-sm text-gray-500">Total Submissions</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.solvedChallenges}</div>
          <div className="text-sm text-gray-500">Solved Challenges</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.averageScore}</div>
          <div className="text-sm text-gray-500">Average Score</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges</h3>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge: any, index: number) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">{badge.emoji || '🏆'}</div>
                <div className="text-sm font-medium text-gray-900">{badge.name}</div>
                <div className="text-xs text-gray-500">{badge.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Badges Yet"
            description="Complete challenges to earn badges and achievements!"
            icon="🏆"
          />
        )}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
        {userData.submissions && userData.submissions.length > 0 ? (
          <div className="space-y-3">
            {userData.submissions.slice(0, 5).map((submission: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${submission.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {submission.challenge?.title || 'Unknown Challenge'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {submission.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Submissions Yet"
            description="Start solving challenges to see your submission history!"
            icon="📝"
            actionText="View Challenges"
            actionHref="/challenges"
          />
        )}
      </div>

      {/* Admin Panel */}
      {userData.role === 'ADMIN' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="btn btn-primary"
            >
              Manage Challenges
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="btn btn-secondary"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
