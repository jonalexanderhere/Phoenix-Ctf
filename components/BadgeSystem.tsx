'use client'

interface BadgeSystemProps {
  badges: string[]
}

const badgeDefinitions = {
  first_blood: {
    name: 'First Blood',
    description: 'Solved your first challenge',
    icon: '🩸',
    color: 'bg-red-100 text-red-800'
  },
  web_master: {
    name: 'Web Master',
    description: 'Solved 3+ web challenges',
    icon: '🌐',
    color: 'bg-blue-100 text-blue-800'
  },
  crypto_expert: {
    name: 'Crypto Expert',
    description: 'Solved 3+ cryptography challenges',
    icon: '🔐',
    color: 'bg-purple-100 text-purple-800'
  },
  forensics_pro: {
    name: 'Forensics Pro',
    description: 'Solved 3+ forensics challenges',
    icon: '🔍',
    color: 'bg-green-100 text-green-800'
  },
  reverse_engineer: {
    name: 'Reverse Engineer',
    description: 'Solved 3+ reverse engineering challenges',
    icon: '⚙️',
    color: 'bg-orange-100 text-orange-800'
  },
  pwn_master: {
    name: 'PWN Master',
    description: 'Solved 3+ binary exploitation challenges',
    icon: '💥',
    color: 'bg-red-100 text-red-800'
  },
  century_club: {
    name: 'Century Club',
    description: 'Reached 100+ points',
    icon: '💯',
    color: 'bg-yellow-100 text-yellow-800'
  },
  half_century: {
    name: 'Half Century',
    description: 'Reached 500+ points',
    icon: '🏆',
    color: 'bg-indigo-100 text-indigo-800'
  },
  thousand_club: {
    name: 'Thousand Club',
    description: 'Reached 1000+ points',
    icon: '👑',
    color: 'bg-pink-100 text-pink-800'
  },
  challenge_hunter: {
    name: 'Challenge Hunter',
    description: 'Solved 10+ challenges',
    icon: '🎯',
    color: 'bg-teal-100 text-teal-800'
  }
}

export default function BadgeSystem({ badges }: BadgeSystemProps) {
  const earnedBadges = badges.map(badgeId => ({
    id: badgeId,
    ...badgeDefinitions[badgeId as keyof typeof badgeDefinitions]
  })).filter(badge => badge.name)

  const allBadges = Object.entries(badgeDefinitions).map(([id, badge]) => ({
    id,
    ...badge,
    earned: badges.includes(id)
  }))

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Earned Badges ({earnedBadges.length})
        </h4>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">{badge.icon}</span>
                </div>
                <div className="ml-4">
                  <h5 className="text-sm font-medium text-gray-900">
                    {badge.name}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {badge.description}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                    Earned
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No badges earned yet</div>
            <div className="text-gray-500 text-sm">
              Start solving challenges to earn your first badge!
            </div>
          </div>
        )}
      </div>

      {/* All Badges */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          All Available Badges
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center p-4 border rounded-lg transition-all ${
                badge.earned
                  ? 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                  : 'bg-gray-50 border-gray-100 opacity-60'
              }`}
            >
              <div className="flex-shrink-0">
                <span className={`text-2xl ${badge.earned ? '' : 'grayscale'}`}>
                  {badge.icon}
                </span>
              </div>
              <div className="ml-4">
                <h5 className={`text-sm font-medium ${
                  badge.earned ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {badge.name}
                </h5>
                <p className={`text-xs ${
                  badge.earned ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {badge.description}
                </p>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  badge.earned
                    ? badge.color
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {badge.earned ? 'Earned' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
