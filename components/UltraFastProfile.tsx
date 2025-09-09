'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSimpleAuth } from '@/hooks/useSimpleAuth'
import { useRouter } from 'next/navigation'
import Navbar from './Navbar'
import EmptyState from './EmptyState'
import InstantLoading, { InstantSkeletonCard } from './InstantLoading'

export default function UltraFastProfile() {
  const { session, loading: authLoading } = useSimpleAuth()
  const status = authLoading ? 'loading' : (session ? 'authenticated' : 'unauthenticated')
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    solvedChallenges: 0,
    averageScore: 0
  })

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/users/${session.user.id}`, {
        cache: 'force-cache', // Use cached data
        next: { revalidate: 60 } // Revalidate every minute
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      setUserData(data)
      
      // Calculate stats
      const totalSubmissions = data.submissions?.length || 0
      const solvedChallenges = data.submissions?.filter((s: any) => s.isCorrect).length || 0
      const averageScore = totalSubmissions > 0 ? data.score / totalSubmissions : 0
      
      setStats({
        totalSubmissions,
        solvedChallenges,
        averageScore: Math.round(averageScore)
      })
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Only fetch if no user data loaded
    if (!userData && session?.user?.id) {
      fetchUserData()
    }
  }, [status, router, userData, session?.user?.id, fetchUserData])

  if (status === 'loading') {
    return <InstantLoading text="Authenticating..." minDuration={100} />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchUserData}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <InstantSkeletonCard key={i} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  const badges = userData?.badges ? JSON.parse(userData.badges) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.role === 'ADMIN' ? 'Admin Dashboard' : 'My Profile'}
              </h1>
              <p className="mt-2 text-gray-600">
                {userData.role === 'ADMIN' 
                  ? 'Manage challenges, view statistics, and monitor platform activity'
                  : 'View your achievements, badges, and challenge history'
                }
              </p>
              {userData.role === 'ADMIN' && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  🔧 Administrator
                </div>
              )}
            </div>
            <button
              onClick={fetchUserData}
              disabled={loading}
              className="btn btn-outline btn-sm"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

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
            {userData?.submissions && userData.submissions.length > 0 ? (
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
      </main>
    </div>
  )
}
