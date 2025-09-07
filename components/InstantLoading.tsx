'use client'

import { useState, useEffect } from 'react'

interface InstantLoadingProps {
  text?: string
  minDuration?: number
  onComplete?: () => void
}

export default function InstantLoading({ 
  text = 'Loading...', 
  minDuration = 200,
  onComplete
}: InstantLoadingProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Fast progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 20 + 10
      })
    }, 30)

    // Complete after minimum duration
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, minDuration)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [minDuration, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Minimalist spinner */}
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        
        {/* Loading text */}
        <div className="text-sm font-medium text-gray-700 mb-3">
          {text}
        </div>
        
        {/* Progress bar */}
        <div className="w-32 bg-gray-200 rounded-full h-1 mx-auto">
          <div 
            className="bg-primary-600 h-1 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

// Skeleton components for instant loading
export function InstantSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 rounded-lg h-3 w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded h-3 w-full"></div>
        <div className="bg-gray-200 rounded h-3 w-5/6"></div>
        <div className="bg-gray-200 rounded h-3 w-4/6"></div>
      </div>
    </div>
  )
}

export function InstantSkeletonCard() {
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

// Hook for instant loading
export function useInstantLoading(initialState = false) {
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
      <InstantLoading 
        text={loadingText}
        onComplete={stopLoading}
        minDuration={150}
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
