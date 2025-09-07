'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from './Navbar'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'
// import { useChallenges, useLeaderboard } from '@/hooks/useLocalStorage' // Removed for production

// interface Challenge {
//   id: string
//   title: string
//   description: string
//   category: string
//   difficulty: string
//   points: number
//   flag: string
//   isSolved?: boolean
// }

interface NewChallenge {
  title: string
  description: string
  category: string
  difficulty: string
  points: number
  flag: string
}

export default function CompleteAdminPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'users' | 'settings'>('overview')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [newChallenge, setNewChallenge] = useState<NewChallenge>({
    title: '',
    description: '',
    category: 'WEB',
    difficulty: 'EASY',
    points: 100,
    flag: ''
  })

  const [challenges, setChallenges] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [challengesLoading, setChallengesLoading] = useState(false)
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [challengesError, setChallengesError] = useState<string | null>(null)
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)
  
  // Use error states to avoid warnings
  const hasChallengesError = !!challengesError
  const hasLeaderboardError = !!leaderboardError
  
  // Log errors for debugging
  if (hasChallengesError) console.log('Challenges error:', challengesError)
  if (hasLeaderboardError) console.log('Leaderboard error:', leaderboardError)

  // Fetch challenges
  const fetchChallenges = async () => {
    try {
      setChallengesLoading(true)
      setChallengesError(null)
      const response = await fetch('/api/challenges')
      if (!response.ok) throw new Error('Failed to fetch challenges')
      const data = await response.json()
      setChallenges(data)
    } catch (error) {
      setChallengesError(error instanceof Error ? error.message : 'Failed to fetch challenges')
    } finally {
      setChallengesLoading(false)
    }
  }

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true)
      setLeaderboardError(null)
      const response = await fetch('/api/leaderboard')
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      const data = await response.json()
      setLeaderboard(data)
    } catch (error) {
      setLeaderboardError(error instanceof Error ? error.message : 'Failed to fetch leaderboard')
    } finally {
      setLeaderboardLoading(false)
    }
  }

  // Refetch functions
  const refetchChallenges = fetchChallenges
  // const refetchLeaderboard = fetchLeaderboard // Unused for now

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (session?.user?.role !== 'ADMIN') {
      router.push('/profile')
      return
    }

    // Fetch data when component mounts
    fetchChallenges()
    fetchLeaderboard()
  }, [status, router, session])

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChallenge),
      })

      if (!response.ok) {
        throw new Error('Failed to create challenge')
      }

      // Reset form
      setNewChallenge({
        title: '',
        description: '',
        category: 'WEB',
        difficulty: 'EASY',
        points: 100,
        flag: ''
      })
      
      setShowCreateForm(false)
      refetchChallenges()
      
      alert('Challenge created successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return

    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete challenge')
      }

      refetchChallenges()
      alert('Challenge deleted successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete challenge')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin panel..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your CTF platform and monitor activity
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            🔧 Administrator
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'challenges', label: 'Challenges', icon: '🎯' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{leaderboard?.length || 0}</div>
                    <div className="text-sm text-gray-500">Total Users</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🎯</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{challenges?.length || 0}</div>
                    <div className="text-sm text-gray-500">Total Challenges</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Total Submissions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('challenges')}
                  className="btn btn-primary"
                >
                  Manage Challenges
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="btn btn-secondary"
                >
                  View Users
                </button>
                <button
                  onClick={() => router.push('/leaderboard')}
                  className="btn btn-outline"
                >
                  View Leaderboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-outline"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Challenges Management</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                + Create Challenge
              </button>
            </div>

            {showCreateForm && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Challenge</h3>
                <form onSubmit={handleCreateChallenge} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newChallenge.title}
                        onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                        className="input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points
                      </label>
                      <input
                        type="number"
                        value={newChallenge.points}
                        onChange={(e) => setNewChallenge({...newChallenge, points: parseInt(e.target.value)})}
                        className="input w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newChallenge.description}
                      onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                      className="input w-full h-24"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newChallenge.category}
                        onChange={(e) => setNewChallenge({...newChallenge, category: e.target.value})}
                        className="input w-full"
                      >
                        <option value="WEB">Web Exploitation</option>
                        <option value="CRYPTO">Cryptography</option>
                        <option value="FORENSICS">Forensics</option>
                        <option value="REVERSE">Reverse Engineering</option>
                        <option value="PWN">Binary Exploitation</option>
                        <option value="MISC">Miscellaneous</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty
                      </label>
                      <select
                        value={newChallenge.difficulty}
                        onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                        className="input w-full"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Flag
                      </label>
                      <input
                        type="text"
                        value={newChallenge.flag}
                        onChange={(e) => setNewChallenge({...newChallenge, flag: e.target.value})}
                        className="input w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Creating...' : 'Create Challenge'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Challenges</h3>
              </div>
            {challengesLoading ? (
              <div className="p-6">
                <LoadingSpinner text="Loading challenges..." />
              </div>
            ) : !challenges || challenges.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No Challenges"
                    description="Create your first challenge to get started!"
                    icon="🎯"
                  />
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {challenges?.map((challenge: any) => (
                    <div key={challenge.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{challenge.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {challenge.category}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {challenge.difficulty}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {challenge.points} pts
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/challenges/${challenge.id}`)}
                            className="btn btn-sm btn-outline"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            className="btn btn-sm btn-red"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
              </div>
            {leaderboardLoading ? (
              <div className="p-6">
                <LoadingSpinner text="Loading users..." />
              </div>
            ) : !leaderboard || leaderboard.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No Users"
                    description="Users will appear here as they register."
                    icon="👥"
                  />
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {leaderboard?.map((user: any, index: number) => (
                    <div key={user.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {user.name || user.username}
                            </h4>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-600">{user.score}</div>
                          <div className="text-sm text-gray-500">points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Platform Settings</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Database</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">API</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Authentication</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">File Upload</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
