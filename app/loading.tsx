import Navbar from '@/components/Navbar'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Loading...</h2>
            <p className="text-gray-600 mt-2">
              Please wait while we load your content
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

