'use client'

import { useState } from 'react'
import BadgeSystem from './BadgeSystem'

interface UserData {
  id: string
  name: string
  email: string
  username: string
  score: number
  badges: string
  role?: string
  createdAt: string
  submissions: Array<{
    id: string
    isCorrect: boolean
    submittedAt: string
    challenge: {
      id: string
      title: string
      category: string
      difficulty: string
      points: number
    }
  }>
}

interface UserProfileProps {
  userData: UserData
}

export default function UserProfile({ userData }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'badges'>('stats')

  const badges = JSON.parse(userData.badges || '[]')
  const solvedChallenges = userData.submissions.filter(sub => sub.isCorrect)
  const totalChallenges = userData.submissions.length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryStats = () => {
    const categoryCounts = solvedChallenges.reduce((acc, sub) => {
      const category = sub.challenge.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / solvedChallenges.length) * 100)
    }))
  }

  const getDifficultyStats = () => {
    const difficultyCounts = solvedChallenges.reduce((acc, sub) => {
      const difficulty = sub.challenge.difficulty
      acc[difficulty] = (acc[difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(difficultyCounts).map(([difficulty, count]) => ({
      difficulty,
      count,
      percentage: Math.round((count / solvedChallenges.length) * 100)
    }))
  }

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="card">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-bold text-2xl">
                {userData.name?.charAt(0)?.toUpperCase() || userData.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {userData.name || userData.username}
              </h2>
              {userData.role === 'ADMIN' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  🔧 Admin
                </span>
              )}
            </div>
            <p className="text-gray-600">@{userData.username}</p>
            <p className="text-sm text-gray-500">Joined {formatDate(userData.createdAt)}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">
              {userData.score.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Score</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'stats', name: 'Statistics', icon: '📊' },
            { id: 'history', name: 'Challenge History', icon: '📝' },
            { id: 'badges', name: 'Badges', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Stats */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Challenges Solved</span>
                <span className="font-semibold">{solvedChallenges.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Submissions</span>
                <span className="font-semibold">{totalChallenges}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold">
                  {totalChallenges > 0 ? Math.round((solvedChallenges.length / totalChallenges) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Points</span>
                <span className="font-semibold">
                  {solvedChallenges.length > 0 ? Math.round(userData.score / solvedChallenges.length) : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {getCategoryStats().map(({ category, count, percentage }) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Difficulty Breakdown</h3>
            <div className="space-y-3">
              {getDifficultyStats().map(({ difficulty, count, percentage }) => (
                <div key={difficulty}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{difficulty}</span>
                    <span className="text-sm font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        difficulty === 'EASY' ? 'bg-green-500' :
                        difficulty === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Challenge History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Challenge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userData.submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.challenge.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {submission.challenge.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        submission.challenge.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                        submission.challenge.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {submission.challenge.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {submission.challenge.points}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        submission.isCorrect
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {submission.isCorrect ? 'Solved' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(submission.submittedAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Achievement Badges</h3>
          <BadgeSystem badges={badges} />
        </div>
      )}
    </div>
  )
}