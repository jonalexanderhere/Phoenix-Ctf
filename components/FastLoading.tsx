'use client'

import { useState, useEffect } from 'react'

// Fast loading component with skeleton
export function FastLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar skeleton */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Main content skeleton */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="h-16 w-96 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-80 bg-gray-200 rounded mx-auto mb-8 animate-pulse"></div>
          <div className="h-12 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
        
        <div className="mt-20">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// Progressive loading component
export function ProgressiveLoader({ 
  children, 
  fallback = <FastLoadingSkeleton />,
  delay = 100 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  delay?: number
}) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!showContent) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Optimized image loader
export function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  priority = false 
}: { 
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading={priority ? 'eager' : 'lazy'}
      />
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
          Failed to load
        </div>
      )}
    </div>
  )
}

// Fast loading hook
export function useFastLoading() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          setIsLoading(false)
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return { isLoading, loadingProgress }
}
