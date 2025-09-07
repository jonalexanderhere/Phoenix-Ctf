'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from './Navbar'
import EmptyState from './EmptyState'
import FastLoadingScreen, { SkeletonList } from './FastLoadingScreen'
import { useLeaderboard } from '@/hooks/useLocalStorage'

// interface LeaderboardEntry {
//   id: string
//   name: string | null
//   username: string
//   score: number
//   solvedCount: number
//   rank: number
// }

export default function OptimizedLeaderboardWithCache() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(false)
  
  const { 
    data: leaderboard = [], 
    loading, 
    error, 
    refetch 
  } = useLeaderboard()

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Show loading screen only if no cached data
    if (!leaderboard.length && !loading) {
      setShowLoading(true)
      refetch()
    }
  }, [status, router, leaderboard.length, loading, refetch])

  const handleRefresh = useCallback(() => {
    setShowLoading(true)
    refetch()
  }, [refetch])

  if (status === 'loading') {
    return <FastLoadingScreen text="Authenticating..." />
  }

  if (showLoading && loading) {
    return <FastLoadingScreen text="Loading leaderboard..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Leaderboard</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={handleRefresh}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
              <p className="mt-2 text-gray-600">
                See how you rank against other players
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="btn btn-outline"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading && !leaderboard.length ? (
          <SkeletonList count={5} />
        ) : leaderboard.length === 0 ? (
          <EmptyState
            title="No Players Yet"
            description="Be the first to solve challenges and appear on the leaderboard!"
            icon="🏆"
            actionText="Start Challenges"
            actionHref="/challenges"
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Players</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {leaderboard.map((player: any, index: number) => (
                <div
                  key={player.id}
                  className={`px-6 py-4 flex items-center justify-between ${
                    session?.user?.id === player.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {index < 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {player.name || player.username}
                        </p>
                        {session?.user?.id === player.id && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        @{player.username} • {player.solvedCount || 0} challenges solved
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {player.score.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
