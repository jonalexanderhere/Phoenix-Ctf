import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-600">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
            <p className="text-lg text-gray-600 mt-4 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link 
              href="/" 
              className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              🏠 Go Home
            </Link>
            <Link 
              href="/challenges" 
              className="btn btn-secondary text-lg px-8 py-3"
            >
              🎯 View Challenges
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

