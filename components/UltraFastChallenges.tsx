'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSimpleAuth } from '@/hooks/useSimpleAuth'
import { useRouter } from 'next/navigation'
import Navbar from './Navbar'
import ChallengeCard from './ChallengeCard'
import EmptyState from './EmptyState'
import InstantLoading, { InstantSkeletonCard } from './InstantLoading'
import { safeFetch } from '@/lib/connectionManager'

export default function UltraFastChallenges() {
  const { session, loading: authLoading } = useSimpleAuth()
  const status = authLoading ? 'loading' : (session ? 'authenticated' : 'unauthenticated')
  const router = useRouter()
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchRef = useRef<number>(0)

  // Memoized categories and difficulties
  const categories = useMemo(() => ({
    WEB: 'Web Exploitation',
    CRYPTO: 'Cryptography',
    FORENSICS: 'Forensics',
    REVERSE: 'Reverse Engineering',
    PWN: 'Binary Exploitation',
    MISC: 'Miscellaneous',
  }), [])

  const difficulties = useMemo(() => ({
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
  }), [])

  const fetchChallenges = useCallback(async (isRetry = false) => {
    // Prevent too frequent requests
    const now = Date.now()
    const timeSinceLastFetch = now - lastFetchRef.current
    
    if (timeSinceLastFetch < 2000 && !isRetry) { // 2 second minimum between requests
      console.log('Request too frequent, skipping...')
      return
    }
    
    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await safeFetch('/api/challenges', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }, {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 5000,
        timeout: 10000,
        onRetry: (attempt, error) => {
          console.log(`Retry attempt ${attempt} for challenges fetch:`, error.message)
        }
      })
      
      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, retryCount) * 1000
          
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1)
            fetchTimeoutRef.current = setTimeout(() => {
              fetchChallenges(true)
            }, waitTime)
            return
          }
          throw new Error('Too many requests. Please wait a moment and try again.')
        }
        throw new Error(`Failed to fetch challenges: ${response.status}`)
      }
      
      const data = await response.json()
      setChallenges(data || [])
      setRetryCount(0) // Reset retry count on success
      lastFetchRef.current = now
    } catch (err) {
      console.error('Error fetching challenges:', err)
      setError(err instanceof Error ? err.message : 'Failed to load challenges')
    } finally {
      setLoading(false)
    }
  }, [retryCount])

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Only fetch if no challenges loaded
    if (challenges.length === 0) {
      fetchChallenges()
    }
  }, [status, router, challenges.length, fetchChallenges])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
  }, [])

  if (status === 'loading') {
    return <InstantLoading text="Authenticating..." minDuration={100} />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Challenges</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-y-4">
              <button
                onClick={() => fetchChallenges()}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Retrying...' : 'Try Again'}
              </button>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500">
                  Retry attempt: {retryCount}/3
                </p>
              )}
            </div>
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
              onClick={() => fetchChallenges()}
              disabled={loading}
              className="btn btn-outline btn-sm"
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
                      {challenges?.filter((c: any) => c.category === key).length || 0}
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
                      {challenges?.filter((c: any) => c.difficulty === key).length || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Challenges grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <InstantSkeletonCard key={i} />
                ))}
              </div>
            ) : !challenges || challenges.length === 0 ? (
              <EmptyState
                title="No Challenges Available"
                description="We're currently preparing new challenges for you. Check back soon for exciting CTF challenges!"
                icon="🚀"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges?.map((challenge: any) => (
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
