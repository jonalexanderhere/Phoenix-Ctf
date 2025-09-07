'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatRelativeTimeIndonesia } from '@/lib/timezone'

interface ActivityItem {
  id: string
  type: 'submission' | 'user' | 'score'
  user: {
    id: string
    name: string
    username: string
  }
  challenge?: {
    id: string
    title: string
    category: string
    difficulty: string
    points: number
  }
  score?: number
  timestamp: string
}

interface ActivityFeedProps {
  limit?: number
  showUserActivity?: boolean
}

export default function ActivityFeed({ limit = 20, showUserActivity = false }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/activity?limit=${limit}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        
        const activityItems: ActivityItem[] = []
        
        // Process recent submissions
        if (data.recentSubmissions && Array.isArray(data.recentSubmissions)) {
          data.recentSubmissions.forEach((submission: any) => {
            activityItems.push({
              id: `sub-${submission.id}`,
              type: 'submission',
              user: submission.user,
              challenge: submission.challenge,
              timestamp: submission.submittedAt
            })
          })
        }
        
        // Process recent users (only if not showing user-specific activity)
        if (!showUserActivity && data.recentUsers && Array.isArray(data.recentUsers)) {
          data.recentUsers.forEach((user: any) => {
            activityItems.push({
              id: `user-${user.id}`,
              type: 'user',
              user: user,
              timestamp: user.createdAt
            })
          })
        }
        
        // Sort by timestamp
        activityItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        
        setActivities(activityItems.slice(0, limit))
        setLastUpdate(data.timestamp || new Date().toISOString())
      } else {
        console.error('Failed to fetch activities:', response.status, response.statusText)
        setActivities([])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [limit, showUserActivity])

  useEffect(() => {
    fetchActivities()
    
    // Set up polling for real-time updates (reduced frequency for better performance)
    const interval = setInterval(fetchActivities, 120000) // Update every 2 minutes for better performance
    
    return () => clearInterval(interval)
  }, [fetchActivities])

  const formatTimeAgo = (timestamp: string) => {
    return formatRelativeTimeIndonesia(timestamp)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return '🎯'
      case 'user':
        return '👤'
      case 'score':
        return '📈'
      default:
        return '📝'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-600'
      case 'MEDIUM':
        return 'text-yellow-600'
      case 'HARD':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
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
          {showUserActivity ? 'Aktivitas Anda' : 'Aktivitas Terbaru'}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {activity.user.name || activity.user.username}
                  </span>
                  {activity.type === 'submission' && activity.challenge && (
                    <>
                      <span className="text-sm text-gray-500">menyelesaikan</span>
                      <span className="text-sm font-medium text-primary-600">
                        {activity.challenge.title}
                      </span>
                    </>
                  )}
                  {activity.type === 'user' && (
                    <span className="text-sm text-gray-500">bergabung ke platform</span>
                  )}
                </div>
                
                {activity.challenge && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs font-medium ${getDifficultyColor(activity.challenge.difficulty)}`}>
                      {activity.challenge.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{activity.challenge.category}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs font-medium text-green-600">
                      +{activity.challenge.points} pts
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">Tidak ada aktivitas terbaru</div>
            <div className="text-gray-500 text-sm">
              {showUserActivity 
                ? 'Mulai menyelesaikan challenge untuk melihat aktivitas Anda di sini!'
                : 'Aktivitas akan muncul di sini saat pengguna menyelesaikan challenge'
              }
            </div>
          </div>
        )}
      </div>
      
      {lastUpdate && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-400 text-center">
            Terakhir diperbarui: {formatTimeAgo(lastUpdate)}
          </div>
        </div>
      )}
    </div>
  )
}
