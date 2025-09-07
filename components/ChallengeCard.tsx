'use client'

import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Challenge } from '@/types'

interface ChallengeWithSolved extends Challenge {
  isSolved: boolean
}

interface ChallengeCardProps {
  challenge: ChallengeWithSolved
  showDescription?: boolean
  showSubmissionForm?: boolean
}

export default function ChallengeCard({ 
  challenge, 
  showDescription = false, 
  showSubmissionForm = true 
}: ChallengeCardProps) {
  const [showHint, setShowHint] = useState(false)
  const [flag, setFlag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'badge-easy'
      case 'MEDIUM':
        return 'badge-medium'
      case 'HARD':
        return 'badge-hard'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!flag.trim()) {
      toast.error('Please enter a flag')
      return
    }

    if (flag.trim().length < 3) {
      toast.error('Flag must be at least 3 characters long')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/challenges/${challenge.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flag: flag.trim() }),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.correct) {
          toast.success(result.message)
          setFlag('')
          // Refresh the page to update the solved status
          setTimeout(() => window.location.reload(), 1000)
        } else {
          toast.error(result.message)
        }
      } else {
        toast.error(result.error || 'Failed to submit flag')
      }
    } catch (error) {
      console.error('Flag submission error:', error)
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {categories[challenge.category as keyof typeof categories]}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
            {difficulties[challenge.difficulty as keyof typeof difficulties]}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {challenge.points} pts
          </span>
        </div>
      </div>

      {showDescription ? (
        <div className="text-gray-700 mb-4">
          <p className="whitespace-pre-wrap">{challenge.description}</p>
        </div>
      ) : (
        <p className="text-gray-700 mb-4 line-clamp-3">
          {challenge.description}
        </p>
      )}

      {challenge.attachment && (
        <div className="mb-4">
          {challenge.category === 'WEB' ? (
            <a
              href={challenge.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              🌐 Access Web Challenge
            </a>
          ) : (
            <a
              href={challenge.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              📁 Download Challenge File
            </a>
          )}
        </div>
      )}

      {challenge.isSolved ? (
        <div className="flex items-center justify-center py-4 bg-success-50 rounded-lg">
          <span className="text-success-600 font-medium">✅ Solved</span>
        </div>
      ) : showSubmissionForm ? (
        <div className="space-y-4">
          {challenge.hint && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {showHint && (
                <p className="mt-2 text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                  💡 {challenge.hint}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmitFlag} className="space-y-3">
            <div>
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="Enter flag..."
                className="input text-sm"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary text-sm py-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Flag'}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center py-4">
          <Link
            href={`/challenges/${challenge.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Challenge Details
          </Link>
        </div>
      )}
    </div>
  )
}