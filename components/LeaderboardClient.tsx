'use client'

import LeaderboardTable from './LeaderboardTable'
import ActivityFeed from './ActivityFeed'

interface LeaderboardEntry {
  id: string
  name: string
  username: string
  score: number
  rank: number
  solvedCount: number
  lastSolved: string | null
  createdAt: string
}

interface LeaderboardClientProps {
  leaderboard: LeaderboardEntry[]
  currentUserId: string
}

export default function LeaderboardClient({ leaderboard, currentUserId }: LeaderboardClientProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <LeaderboardTable leaderboard={leaderboard} currentUserId={currentUserId} />
      </div>
      
      <div className="lg:col-span-1">
        <ActivityFeed limit={10} />
      </div>
    </div>
  )
}
