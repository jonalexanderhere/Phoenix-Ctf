'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  username: string
  role: string
  score: number
}

interface Session {
  user: User
  expires: string
}

export function useSimpleAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  // Prevent multiple simultaneous session checks
  useEffect(() => {
    if (loading) return
    
    const interval = setInterval(() => {
      if (!loading) {
        checkSession()
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [loading])

  const checkSession = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/simple-session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      console.log('Session check response status:', response.status)
      
      if (response.ok) {
        try {
          const data = await response.json()
          console.log('Session data received:', data)
          if (data && data.user) {
            setSession(data)
          } else {
            console.log('Invalid session data structure')
            setSession(null)
          }
        } catch (parseError) {
          console.error('Session data parse error:', parseError)
          setSession(null)
        }
      } else {
        console.log('Session check failed with status:', response.status)
        setSession(null)
      }
    } catch (error) {
      console.error('Session check error:', error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...')
      const response = await fetch('/api/auth/simple-logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Logout response status:', response.status)
      
      if (response.ok) {
        console.log('Logout successful')
      } else {
        console.log('Logout failed with status:', response.status)
      }
      
      setSession(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local session
      setSession(null)
    }
  }

  return {
    session,
    loading,
    signOut,
    checkSession
  }
}
