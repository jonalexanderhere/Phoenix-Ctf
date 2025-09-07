// Local Authentication System using localStorage
// This replaces database authentication to avoid connection issues

export interface LocalUser {
  id: string
  email: string
  name: string
  username: string
  role: 'USER' | 'ADMIN'
  score: number
  badges: string[]
  createdAt: string
}

export interface LocalChallenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  points: number
  flag: string
  hint?: string
  attachment?: string
  isActive: boolean
  createdAt: string
}

export interface LocalSubmission {
  id: string
  userId: string
  challengeId: string
  flag: string
  isCorrect: boolean
  submittedAt: string
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'phx_ctf_users',
  CHALLENGES: 'phx_ctf_challenges',
  SUBMISSIONS: 'phx_ctf_submissions',
  CURRENT_USER: 'phx_ctf_current_user',
  SESSION: 'phx_ctf_session'
}

// Initialize default data
export const initializeLocalData = () => {
  if (typeof window === 'undefined') return

  // Initialize users if not exists
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: LocalUser[] = [
      {
        id: '1',
        email: 'admin@ctf.com',
        name: 'Admin User',
        username: 'admin',
        role: 'ADMIN',
        score: 1000,
        badges: ['First Blood', 'Admin'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user@ctf.com',
        name: 'Test User',
        username: 'user',
        role: 'USER',
        score: 500,
        badges: ['First Blood'],
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers))
  }

  // Initialize challenges if not exists
  if (!localStorage.getItem(STORAGE_KEYS.CHALLENGES)) {
    const defaultChallenges: LocalChallenge[] = [
      {
        id: '1',
        title: 'Welcome Challenge',
        description: 'This is your first challenge! The flag is hidden somewhere in this description. Look carefully for the pattern: CTF{hello_world}',
        category: 'MISC',
        difficulty: 'EASY',
        points: 10,
        flag: 'CTF{hello_world}',
        hint: 'Look for text in curly braces',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Base64 Decoder',
        description: 'Decode this base64 string: V2VsY29tZSB0byBvdXIgQ1RGIGNvbXBldGl0aW9uIQ==',
        category: 'CRYPTO',
        difficulty: 'EASY',
        points: 25,
        flag: 'CTF{base64_is_easy}',
        hint: 'Use an online base64 decoder',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Simple Web Challenge',
        description: 'Visit the URL: http://localhost:3000/web-challenge and find the hidden flag',
        category: 'WEB',
        difficulty: 'MEDIUM',
        points: 50,
        flag: 'CTF{web_exploitation}',
        hint: 'Check the page source',
        attachment: 'http://localhost:3000/web-challenge',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(defaultChallenges))
  }

  // Initialize submissions if not exists
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]))
  }
}

// User management
export const getUsers = (): LocalUser[] => {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  return users ? JSON.parse(users) : []
}

export const getUserById = (id: string): LocalUser | null => {
  const users = getUsers()
  return users.find(user => user.id === id) || null
}

export const getUserByEmail = (email: string): LocalUser | null => {
  const users = getUsers()
  return users.find(user => user.email === email) || null
}

export const createUser = (userData: Omit<LocalUser, 'id' | 'createdAt'>): LocalUser => {
  const users = getUsers()
  const newUser: LocalUser = {
    ...userData,
    id: (users.length + 1).toString(),
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  return newUser
}

export const updateUser = (id: string, updates: Partial<LocalUser>): LocalUser | null => {
  const users = getUsers()
  const userIndex = users.findIndex(user => user.id === id)
  if (userIndex === -1) return null
  
  users[userIndex] = { ...users[userIndex], ...updates }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  return users[userIndex]
}

// Challenge management
export const getChallenges = (): LocalChallenge[] => {
  if (typeof window === 'undefined') return []
  const challenges = localStorage.getItem(STORAGE_KEYS.CHALLENGES)
  return challenges ? JSON.parse(challenges) : []
}

export const getChallengeById = (id: string): LocalChallenge | null => {
  const challenges = getChallenges()
  return challenges.find(challenge => challenge.id === id) || null
}

export const createChallenge = (challengeData: Omit<LocalChallenge, 'id' | 'createdAt'>): LocalChallenge => {
  const challenges = getChallenges()
  const newChallenge: LocalChallenge = {
    ...challengeData,
    id: (challenges.length + 1).toString(),
    createdAt: new Date().toISOString()
  }
  challenges.push(newChallenge)
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges))
  return newChallenge
}

export const updateChallenge = (id: string, updates: Partial<LocalChallenge>): LocalChallenge | null => {
  const challenges = getChallenges()
  const challengeIndex = challenges.findIndex(challenge => challenge.id === id)
  if (challengeIndex === -1) return null
  
  challenges[challengeIndex] = { ...challenges[challengeIndex], ...updates }
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges))
  return challenges[challengeIndex]
}

export const deleteChallenge = (id: string): boolean => {
  const challenges = getChallenges()
  const challengeIndex = challenges.findIndex(challenge => challenge.id === id)
  if (challengeIndex === -1) return false
  
  challenges.splice(challengeIndex, 1)
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges))
  
  // Also delete related submissions
  const submissions = getSubmissions()
  const filteredSubmissions = submissions.filter(sub => sub.challengeId !== id)
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(filteredSubmissions))
  
  return true
}

// Submission management
export const getSubmissions = (): LocalSubmission[] => {
  if (typeof window === 'undefined') return []
  const submissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)
  return submissions ? JSON.parse(submissions) : []
}

export const getSubmissionsByUser = (userId: string): LocalSubmission[] => {
  const submissions = getSubmissions()
  return submissions.filter(sub => sub.userId === userId)
}

export const getSubmissionsByChallenge = (challengeId: string): LocalSubmission[] => {
  const submissions = getSubmissions()
  return submissions.filter(sub => sub.challengeId === challengeId)
}

export const createSubmission = (submissionData: Omit<LocalSubmission, 'id' | 'submittedAt'>): LocalSubmission => {
  const submissions = getSubmissions()
  const newSubmission: LocalSubmission = {
    ...submissionData,
    id: (submissions.length + 1).toString(),
    submittedAt: new Date().toISOString()
  }
  submissions.push(newSubmission)
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions))
  
  // Update user score if correct
  if (newSubmission.isCorrect) {
    const challenge = getChallengeById(newSubmission.challengeId)
    if (challenge) {
      const user = getUserById(newSubmission.userId)
      if (user) {
        updateUser(newSubmission.userId, { score: user.score + challenge.points })
      }
    }
  }
  
  return newSubmission
}

// Authentication
export const login = (email: string, password: string): LocalUser | null => {
  const user = getUserByEmail(email)
  if (!user) return null
  
  // Simple password check (in real app, use proper hashing)
  const validPasswords: Record<string, string> = {
    'admin@ctf.com': 'admin123',
    'user@ctf.com': 'user123'
  }
  
  if (validPasswords[email] !== password) return null
  
  // Set current user
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  
  // Set session
  const session = {
    user: user,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
  
  return user
}

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  localStorage.removeItem(STORAGE_KEYS.SESSION)
}

export const getCurrentUser = (): LocalUser | null => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return user ? JSON.parse(user) : null
}

export const getSession = (): { user: LocalUser; expires: string } | null => {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem(STORAGE_KEYS.SESSION)
  if (!session) return null
  
  const parsedSession = JSON.parse(session)
  if (new Date(parsedSession.expires) < new Date()) {
    logout()
    return null
  }
  
  return parsedSession
}

// Leaderboard
export const getLeaderboard = (): Array<LocalUser & { rank: number; challengesSolved: number }> => {
  const users = getUsers()
  const submissions = getSubmissions()
  
  const leaderboard = users.map(user => {
    const userSubmissions = submissions.filter(sub => sub.userId === user.id && sub.isCorrect)
    return {
      ...user,
      rank: 0, // Will be set after sorting
      challengesSolved: userSubmissions.length
    }
  })
  
  // Sort by score descending
  leaderboard.sort((a, b) => b.score - a.score)
  
  // Set ranks
  leaderboard.forEach((user, index) => {
    user.rank = index + 1
  })
  
  return leaderboard
}

// Initialize data on import (client-side only)
if (typeof window !== 'undefined') {
  try {
    initializeLocalData()
  } catch (error) {
    console.error('Error initializing localStorage data:', error)
  }
}
