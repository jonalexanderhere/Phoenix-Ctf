'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from './Navbar'
import ChallengeCard from './ChallengeCard'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'
import { Challenge } from '@/types'

interface ChallengeWithSolved extends Challenge {
  isSolved: boolean
}

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

export default function OptimizedChallengesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [challenges, setChallenges] = useState<ChallengeWithSolved[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/challenges')
      
      if (!response.ok) {
        throw new Error('Failed to fetch challenges')
      }
      
      const data = await response.json()
      setChallenges(data)
    } catch (err) {
      console.error('Error fetching challenges:', err)
      setError('Failed to load challenges')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    fetchChallenges()
  }, [status, router, fetchChallenges])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading challenges..." />
      </div>
    )
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
              onClick={fetchChallenges}
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
          <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
          <p className="mt-2 text-gray-600">
            Test your cybersecurity skills with our collection of CTF challenges
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading challenges..." />
          </div>
        ) : (
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
                        {challenges.filter((c) => c.category === key).length}
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
                        {challenges.filter((c) => c.difficulty === key).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Challenges grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    showSubmissionForm={false}
                  />
                ))}
              </div>
              
              {challenges.length === 0 && !loading && (
                <EmptyState
                  title="No Challenges Available"
                  description="We're currently preparing new challenges for you. Check back soon for exciting CTF challenges!"
                  icon="🚀"
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
