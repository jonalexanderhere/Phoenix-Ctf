'use client'

import { useState, useEffect } from 'react'
// import { LocalStorageManager } from '@/lib/localStorage'

interface FastLoadingScreenProps {
  text?: string
  showProgress?: boolean
  onComplete?: () => void
  minDuration?: number
}

export default function FastLoadingScreen({ 
  text = 'Loading...', 
  showProgress = true,
  onComplete,
  minDuration = 500
}: FastLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, minDuration - elapsed)
      
      setTimeout(() => {
        setIsComplete(true)
        onComplete?.()
      }, remaining)
    }
  }, [progress, startTime, minDuration, onComplete])

  if (isComplete) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"
            style={{ animationDuration: '0.8s' }}
          ></div>
        </div>
        
        {/* Loading text */}
        <div className="text-lg font-medium text-gray-900 mb-4">
          {text}
        </div>
        
        {/* Progress bar */}
        {showProgress && (
          <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        )}
        
        {/* Loading dots animation */}
        <div className="flex justify-center mt-4 space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

// Optimized loading hook
export function useFastLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingText, setLoadingText] = useState('Loading...')

  const startLoading = (text = 'Loading...') => {
    setLoadingText(text)
    setIsLoading(true)
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  const LoadingComponent = () => {
    if (!isLoading) return null
    
    return (
      <FastLoadingScreen 
        text={loadingText}
        onComplete={stopLoading}
        minDuration={300}
      />
    )
  }

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    LoadingComponent
  }
}
