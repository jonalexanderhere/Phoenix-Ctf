// LocalStorage utility with error handling and type safety
export class LocalStorageManager {
  private static isClient = typeof window !== 'undefined'

  static setItem<T>(key: string, value: T, ttl?: number): boolean {
    if (!this.isClient) return false

    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl: ttl || null
      }
      localStorage.setItem(key, JSON.stringify(item))
      return true
    } catch (error) {
      console.warn('Failed to set localStorage item:', error)
      return false
    }
  }

  static getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isClient) return defaultValue || null

    try {
      const item = localStorage.getItem(key)
      if (!item) return defaultValue || null

      const parsed = JSON.parse(item)
      
      // Check if item has expired
      if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
        this.removeItem(key)
        return defaultValue || null
      }

      return parsed.value
    } catch (error) {
      console.warn('Failed to get localStorage item:', error)
      return defaultValue || null
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isClient) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn('Failed to remove localStorage item:', error)
      return false
    }
  }

  static clear(): boolean {
    if (!this.isClient) return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
      return false
    }
  }

  static hasItem(key: string): boolean {
    if (!this.isClient) return false
    return localStorage.getItem(key) !== null
  }

  static getSize(): number {
    if (!this.isClient) return 0
    
    try {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }
      return total
    } catch (error) {
      console.warn('Failed to calculate localStorage size:', error)
      return 0
    }
  }
}

// Cache keys
export const CACHE_KEYS = {
  USER_DATA: 'user_data',
  CHALLENGES: 'challenges',
  LEADERBOARD: 'leaderboard',
  SUBMISSIONS: 'submissions',
  SESSION: 'session_data',
  PREFERENCES: 'user_preferences'
} as const

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  USER_DATA: 5 * 60 * 1000, // 5 minutes
  CHALLENGES: 10 * 60 * 1000, // 10 minutes
  LEADERBOARD: 2 * 60 * 1000, // 2 minutes
  SUBMISSIONS: 5 * 60 * 1000, // 5 minutes
  SESSION: 30 * 60 * 1000, // 30 minutes
  PREFERENCES: 24 * 60 * 60 * 1000 // 24 hours
} as const
