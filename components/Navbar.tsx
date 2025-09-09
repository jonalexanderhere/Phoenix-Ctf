'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const sessionData = useSession()
  const session = sessionData?.data
  const status = sessionData?.status

  const handleSignOut = () => {
    try {
      signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback: redirect to home page
      window.location.href = '/'
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">PHX CTF</h1>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/challenges" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Challenges
              </Link>
              <Link href="/leaderboard" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Leaderboard
              </Link>
              <Link href="/profile" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Profile
              </Link>
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session?.user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{session.user.name || session.user.username || 'User'}</p>
                  <p className="text-gray-500">Score: {session.user.score || 0}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="btn btn-secondary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}