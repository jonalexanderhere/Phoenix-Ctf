export interface User {
  id: string
  name: string | null
  email: string
  username: string
  role: 'USER' | 'ADMIN'
  score: number
  badges: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: 'WEB' | 'CRYPTO' | 'FORENSICS' | 'REVERSE' | 'PWN' | 'MISC'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  points: number
  flag: string
  hint?: string | null
  attachment?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  isSolved?: boolean
}

export interface Submission {
  id: string
  userId: string
  challengeId: string
  flag: string
  isCorrect: boolean
  submittedAt: Date
  user?: User
  challenge?: Challenge
}

export interface LeaderboardEntry {
  id: string
  name: string | null
  username: string
  score: number
  rank: number
  solvedCount: number
  lastSolved: Date | null
  createdAt: Date
}

export interface ActivityItem {
  id: string
  type: 'submission' | 'registration' | 'score_change'
  user: {
    id: string
    name: string | null
    username: string
  }
  challenge?: {
    id: string
    title: string
    category: string
    difficulty: string
    points: number
  }
  timestamp: Date
  points?: number
}
