'use client'

import { useState, useEffect, useCallback } from 'react'

interface Submission {
  id: string
  flag: string
  isCorrect: boolean
  submittedAt: string
  challenge: {
    id: string
    title: string
    category: string
    difficulty: string
    points: number
  }
}

interface SubmissionHistoryProps {
  userId?: string
  challengeId?: string
  limit?: number
}

export default function SubmissionHistory({ userId, challengeId, limit = 50 }: SubmissionHistoryProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const fetchSubmissions = useCallback(async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: currentOffset.toString(),
        ...(userId && { userId }),
        ...(challengeId && { challengeId }),
      })

      const response = await fetch(`/api/submissions?${params}`)
      if (response.ok) {
        const data = await response.json()
        
        if (data.submissions && Array.isArray(data.submissions)) {
          if (reset) {
            setSubmissions(data.submissions)
          } else {
            setSubmissions(prev => [...prev, ...data.submissions])
          }
          
          setHasMore(data.hasMore || false)
          setOffset(currentOffset + data.submissions.length)
        } else {
          console.error('Invalid submissions data:', data)
        }
      } else {
        console.error('Failed to fetch submissions:', response.status)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, challengeId, limit, offset])

  useEffect(() => {
    fetchSubmissions(true)
  }, [userId, challengeId, fetchSubmissions])

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchSubmissions()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HARD':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isCorrect: boolean) => {
    return isCorrect 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  if (loading && submissions.length === 0) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Submission History
        </h3>
        <div className="text-sm text-gray-500">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-3">
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {submission.challenge.title}
                    </h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(submission.challenge.difficulty)}`}>
                      {submission.challenge.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                      {submission.challenge.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Points: {submission.challenge.points}</span>
                    <span>•</span>
                    <span>Submitted: {formatDate(submission.submittedAt)}</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Flag:</span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {submission.flag}
                      </code>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(submission.isCorrect)}`}>
                    {submission.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No submissions yet</div>
            <div className="text-gray-500 text-sm">
              {challengeId 
                ? 'No submissions for this challenge yet'
                : 'Start solving challenges to see your submission history here!'
              }
            </div>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn btn-secondary disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
