'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️</h1>
            <h2 className="text-3xl font-bold text-gray-900">Something went wrong!</h2>
            <p className="text-lg text-gray-600 mt-4 max-w-md mx-auto">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>
          </div>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={reset}
              className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              🔄 Try Again
            </button>
            <Link 
              href="/" 
              className="btn btn-secondary text-lg px-8 py-3"
            >
              🏠 Go Home
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left max-w-2xl mx-auto">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </main>
    </div>
  )
}

