'use client'

import { useState, useEffect, useCallback } from 'react'
import { LocalStorageManager, CACHE_KEYS, CACHE_TTL } from '@/lib/localStorage'

// eslint-disable-next-line no-unused-vars
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  ttl?: number
): [T, (value: T | ((val: T) => T)) => void, () => void] { // eslint-disable-line no-unused-vars
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    return LocalStorageManager.getItem(key, initialValue) || initialValue
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => { // eslint-disable-line no-unused-vars
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        LocalStorageManager.setItem(key, valueToStore, ttl)
      }
    } catch (error) {
      console.warn('Failed to set localStorage value:', error)
    }
  }, [key, storedValue, ttl])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        LocalStorageManager.removeItem(key)
      }
    } catch (error) {
      console.warn('Failed to remove localStorage value:', error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

// Specialized hooks for common data types
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number,
  dependencies: any[] = []
): {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
  clearCache: () => void
} {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    // Try to get from cache first
    const cached = LocalStorageManager.getItem<T>(key)
    if (cached) {
      setData(cached)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      LocalStorageManager.setItem(key, result, ttl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, ttl, ...dependencies]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearCache = useCallback(() => {
    LocalStorageManager.removeItem(key)
    setData(null)
  }, [key])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    clearCache
  }
}

// Hook for user data with caching
export function useUserData() {
  return useCachedData(
    CACHE_KEYS.USER_DATA,
    async () => {
      const response = await fetch('/api/users/me')
      if (!response.ok) throw new Error('Failed to fetch user data')
      return response.json()
    },
    CACHE_TTL.USER_DATA
  )
}

// Hook for challenges with caching
export function useChallenges() {
  return useCachedData(
    CACHE_KEYS.CHALLENGES,
    async () => {
      const response = await fetch('/api/challenges')
      if (!response.ok) throw new Error('Failed to fetch challenges')
      return response.json()
    },
    CACHE_TTL.CHALLENGES
  )
}

// Hook for leaderboard with caching
export function useLeaderboard() {
  return useCachedData(
    CACHE_KEYS.LEADERBOARD,
    async () => {
      const response = await fetch('/api/leaderboard')
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      return response.json()
    },
    CACHE_TTL.LEADERBOARD
  )
}
