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

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/simple-session')
      if (response.ok) {
        const data = await response.json()
        setSession(data)
      } else {
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
      await fetch('/api/auth/simple-logout', { method: 'POST' })
      setSession(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    session,
    loading,
    signOut,
    checkSession
  }
}
