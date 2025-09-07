'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from './Navbar'
import ChallengeCard from './ChallengeCard'
import EmptyState from './EmptyState'
import FastLoadingScreen, { SkeletonList } from './FastLoadingScreen'
import { useChallenges } from '@/hooks/useLocalStorage'
// import { Challenge } from '@/types'

// interface ChallengeWithSolved extends Challenge {
//   isSolved: boolean
// }

const categories = {
  WEB: 'Web Exploitation',
  CRYPTO: 'Cryptography',
  FORENSICS: 'Forensics',
  REVERSE: 'Reverse Engineering',
  PWN: 'Binary Exploitation',
  MISC: 'Miscellaneous',
}

const difficulties = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
}

export default function OptimizedChallengesWithCache() {
  const { status } = useSession()
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(false)
  
  const { 
    data: challenges = [], 
    loading, 
    error, 
    refetch 
  } = useChallenges()

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Show loading screen only if no cached data
    if (!challenges.length && !loading) {
      setShowLoading(true)
      refetch()
    }
  }, [status, router, challenges.length, loading, refetch])

  const handleRefresh = useCallback(() => {
    setShowLoading(true)
    refetch()
  }, [refetch])

  if (status === 'loading') {
    return <FastLoadingScreen text="Authenticating..." />
  }

  if (showLoading && loading) {
    return <FastLoadingScreen text="Loading challenges..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Challenges</h1>
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
              <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
              <p className="mt-2 text-gray-600">
                Test your cybersecurity skills with our collection of CTF challenges
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {Object.entries(categories).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{value}</span>
                    <span className="text-xs text-gray-400">
                      {challenges.filter((c: any) => c.category === key).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Difficulty</h3>
              <div className="space-y-2">
                {Object.entries(difficulties).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{value}</span>
                    <span className="text-xs text-gray-400">
                      {challenges.filter((c: any) => c.difficulty === key).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Challenges grid */}
          <div className="lg:col-span-3">
            {loading && !challenges.length ? (
              <SkeletonList count={6} />
            ) : challenges.length === 0 ? (
              <EmptyState
                title="No Challenges Available"
                description="We're currently preparing new challenges for you. Check back soon for exciting CTF challenges!"
                icon="🚀"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge: any) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    showSubmissionForm={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
