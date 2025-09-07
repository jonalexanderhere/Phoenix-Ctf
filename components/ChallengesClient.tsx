'use client'

import ChallengeCard from './ChallengeCard'
import { LazyActivityFeed } from './LazyComponents'
import { Challenge } from '@/types'

interface ChallengeWithSolved extends Challenge {
  isSolved: boolean
}

interface ChallengesClientProps {
  challenges: ChallengeWithSolved[]
  categories: Record<string, string>
  difficulties: Record<string, string>
}

export default function ChallengesClient({ challenges, categories, difficulties }: ChallengesClientProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar with categories and activity */}
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

        <LazyActivityFeed limit={8} />
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
        
        {challenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No challenges available</div>
            <div className="text-gray-500 text-sm mt-2">
              Check back later for new challenges
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
