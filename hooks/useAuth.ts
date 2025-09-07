'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  username: string
  role: string
  score: number
  badges: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const userData = localStorage.getItem('user')

    if (isAuthenticated === 'true' && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('isAuthenticated', 'true')
        setUser(result.user)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'An error occurred' }
    }
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAuthenticated = !!user

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  }
}
