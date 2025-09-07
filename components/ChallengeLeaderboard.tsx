'use client'

import { useState, useEffect } from 'react'
import { TrophyIcon, ClockIcon } from '@heroicons/react/24/outline'

interface ChallengeSubmission {
  id: string
  isCorrect: boolean
  submittedAt: string
  user: {
    id: string
    name: string
    username: string
  }
}

interface ChallengeLeaderboardProps {
  challengeId: string
  challengeTitle: string
  limit?: number
}

export default function ChallengeLeaderboard({ 
  challengeId, 
  challengeTitle, 
  limit = 10 
}: ChallengeLeaderboardProps) {
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChallengeLeaderboard = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/challenges/${challengeId}/leaderboard?limit=${limit}`)
        
        if (!res.ok) {
          throw new Error('Failed to fetch challenge leaderboard')
        }
        
        const data = await res.json()
        setSubmissions(data)
      } catch (err) {
        console.error('Error fetching challenge leaderboard:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (challengeId) {
      fetchChallengeLeaderboard()
    }
  }, [challengeId, limit])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {challengeTitle} - Leaderboard
        </h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {challengeTitle} - Leaderboard
        </h3>
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Error loading leaderboard</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  const correctSubmissions = submissions.filter(sub => sub.isCorrect)
  const uniqueUsers = correctSubmissions.reduce((acc, submission) => {
    if (!acc.find(user => user.user.id === submission.user.id)) {
      acc.push(submission)
    }
    return acc
  }, [] as ChallengeSubmission[])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {challengeTitle} - Leaderboard
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <TrophyIcon className="w-4 h-4 mr-1" />
          {uniqueUsers.length} solver{uniqueUsers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {uniqueUsers.length === 0 ? (
        <div className="text-center py-8">
          <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No one has solved this challenge yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to solve it!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {uniqueUsers.slice(0, limit).map((submission, index) => (
            <div
              key={submission.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : index === 1 
                  ? 'bg-gray-50 border border-gray-200'
                  : index === 2
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  index === 0 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : index === 1 
                    ? 'bg-gray-400 text-gray-900'
                    : index === 2
                    ? 'bg-orange-400 text-orange-900'
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {submission.user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    @{submission.user.username}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 mr-1" />
                {new Date(submission.submittedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
