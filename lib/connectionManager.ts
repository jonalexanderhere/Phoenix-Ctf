// Connection manager for handling connection issues and retries
interface ConnectionConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  timeout: number
}

interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  timeout?: number
  // eslint-disable-next-line no-unused-vars
  onRetry?: (_attempt: number, _error: Error) => void
}

class ConnectionManager {
  private defaultConfig: ConnectionConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    timeout: 30000
  }

  private activeRequests = new Map<string, AbortController>()

  // Create a unique key for request deduplication
  private getRequestKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET'
    const body = options?.body ? JSON.stringify(options.body) : ''
    return `${method}:${url}:${body}`
  }

  // Exponential backoff delay calculation
  private calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
    const delay = baseDelay * Math.pow(2, attempt - 1)
    return Math.min(delay, maxDelay)
  }

  // Clean up completed requests
  private cleanupRequest(key: string) {
    this.activeRequests.delete(key)
  }

  // Fetch with retry logic and connection management
  async fetchWithRetry(
    url: string, 
    options: RequestInit = {}, 
    retryOptions: RetryOptions = {}
  ): Promise<Response> {
    const config = { ...this.defaultConfig, ...retryOptions }
    const requestKey = this.getRequestKey(url, options)
    
    // Check if request is already in progress
    if (this.activeRequests.has(requestKey)) {
      const existingController = this.activeRequests.get(requestKey)
      if (existingController && !existingController.signal.aborted) {
        // Wait for existing request to complete
        return new Promise((resolve, reject) => {
          const checkInterval = setInterval(() => {
            if (!this.activeRequests.has(requestKey)) {
              clearInterval(checkInterval)
              // Retry the request
              this.fetchWithRetry(url, options, retryOptions)
                .then(resolve)
                .catch(reject)
            }
          }, 100)
        })
      }
    }

    // Create abort controller for this request
    const controller = new AbortController()
    this.activeRequests.set(requestKey, controller)

    // Set timeout
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, config.timeout)

    // Merge abort signal with existing options
    const fetchOptions: RequestInit = {
      ...options,
      signal: controller.signal
    }

    let lastError: Error | undefined

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        const response = await fetch(url, fetchOptions)
        
        // Clear timeout and cleanup
        clearTimeout(timeoutId)
        this.cleanupRequest(requestKey)
        
        // Check if response is ok
        if (!response.ok) {
          if (response.status === 429) {
            // Rate limited - wait and retry
            const retryAfter = response.headers.get('Retry-After')
            const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : this.calculateDelay(attempt, config.baseDelay, config.maxDelay)
            
            if (attempt < config.maxRetries) {
              await new Promise(resolve => setTimeout(resolve, waitTime))
              continue
            }
          }
          
          // For other errors, throw immediately
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        return response
        
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on abort or certain errors
        if (error instanceof Error && (
          error.name === 'AbortError' ||
          error.message.includes('ECONNRESET') ||
          error.message.includes('ENOTFOUND')
        )) {
          break
        }
        
        // Call retry callback
        if (retryOptions.onRetry) {
          retryOptions.onRetry(attempt, lastError!)
        }
        
        // If this is the last attempt, throw the error
        if (attempt === config.maxRetries) {
          break
        }
        
        // Calculate delay for next retry
        const delay = this.calculateDelay(attempt, config.baseDelay, config.maxDelay)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    // Cleanup on failure
    clearTimeout(timeoutId)
    this.cleanupRequest(requestKey)
    
    throw lastError || new Error('Request failed after all retries')
  }

  // Cancel all active requests
  cancelAllRequests() {
    this.activeRequests.forEach((controller, key) => {
      controller.abort()
      this.cleanupRequest(key)
    })
  }

  // Get active request count
  getActiveRequestCount(): number {
    return this.activeRequests.size
  }
}

// Global connection manager instance
export const connectionManager = new ConnectionManager()

// Helper function for common fetch operations
export async function safeFetch(
  url: string, 
  options: RequestInit = {}, 
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return connectionManager.fetchWithRetry(url, options, retryOptions)
}

// Helper function for API calls with proper error handling
export async function apiCall<T>(
  url: string, 
  options: RequestInit = {}, 
  retryOptions: RetryOptions = {}
): Promise<T> {
  const response = await safeFetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }, retryOptions)
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    connectionManager.cancelAllRequests()
  })
}
