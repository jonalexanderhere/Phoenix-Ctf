'use client'

import { useState, useEffect } from 'react'
import { ClockIcon, TrophyIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { formatChallengeHistoryTime, formatRelativeTimeIndonesia } from '@/lib/timezone'

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

interface ChallengeHistoryProps {
  challengeId: string
  challengeTitle: string
  limit?: number
}

export default function ChallengeHistory({ 
  challengeId, 
  challengeTitle, 
  limit = 10 
}: ChallengeHistoryProps) {
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChallengeHistory = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/challenges/${challengeId}/leaderboard?limit=${limit}`, {
          cache: 'force-cache', // Cache for better performance
          next: { revalidate: 60 } // Revalidate every minute
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch challenge history')
        }
        
        const data = await res.json()
        setSubmissions(data)
      } catch (err) {
        console.error('Error fetching challenge history:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (challengeId) {
      fetchChallengeHistory()
    }
  }, [challengeId, limit])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {challengeTitle} - Completion History
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
          {challengeTitle} - Completion History
        </h3>
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Error loading history</p>
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

  const formatDateTime = (dateString: string) => {
    return formatChallengeHistoryTime(dateString)
  }

  const getTimeDifference = (dateString: string) => {
    return formatRelativeTimeIndonesia(dateString)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {challengeTitle} - Riwayat Penyelesaian
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <CheckCircleIcon className="w-4 h-4 mr-1" />
          {uniqueUsers.length} penyelesai
        </div>
      </div>

      {uniqueUsers.length === 0 ? (
        <div className="text-center py-8">
          <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada yang menyelesaikan challenge ini</p>
          <p className="text-sm text-gray-400 mt-1">Jadilah yang pertama menyelesaikannya!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {uniqueUsers.slice(0, limit).map((submission, index) => {
            const { date, time } = formatDateTime(submission.submittedAt)
            const timeAgo = getTimeDifference(submission.submittedAt)
            
            return (
              <div
                key={submission.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm' 
                    : index === 1 
                    ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-sm ${
                    index === 0 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
                      : index === 1 
                      ? 'bg-gradient-to-r from-gray-400 to-slate-400 text-white'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">
                        {submission.user.name || submission.user.username}
                      </p>
                      {index === 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Penyelesai Pertama
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      @{submission.user.username}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">{timeAgo}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {date} pukul {time} WIB
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {uniqueUsers.length > limit && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Menampilkan {limit} dari {uniqueUsers.length} penyelesai
          </p>
        </div>
      )}
    </div>
  )
}
