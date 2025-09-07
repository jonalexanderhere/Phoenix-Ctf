'use client'

import UserProfile from './UserProfile'
import ActivityFeed from './ActivityFeed'
import SubmissionHistory from './SubmissionHistory'

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

interface ProfileClientProps {
  userData: UserData
  userId: string
}

export default function ProfileClient({ userData, userId }: ProfileClientProps) {
  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <UserProfile userData={userData} />
      </div>

      {/* Responsive Grid for Activity and History */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <ActivityFeed showUserActivity={true} limit={10} />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission History</h3>
          <SubmissionHistory userId={userId} limit={10} />
        </div>
      </div>
    </div>
  )
}
