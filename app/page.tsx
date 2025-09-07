import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
              🚀 New challenges added weekly
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to PHX CTF
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Welcome to PHX CTF Platform! We're currently preparing exciting cybersecurity challenges. 
            Stay tuned for web exploitation, cryptography, forensics, and reverse engineering challenges.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            {session ? (
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                <Link href="/challenges" className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
                  🎯 Start Challenges
                </Link>
                <Link href="/profile" className="btn btn-secondary text-lg px-8 py-3">
                  👤 My Profile
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                <Link href="/auth/signup" className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
                  🚀 Get Started
                </Link>
                <Link href="/auth/signin" className="btn btn-secondary text-lg px-8 py-3">
                  🔐 Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Challenge Categories</h2>
            <p className="mt-4 text-lg text-gray-600">
              Explore different types of cybersecurity challenges
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🌐</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Web Exploitation</h3>
                  <p className="text-gray-500">SQL injection, XSS, CSRF, and more web vulnerabilities</p>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🔐</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Cryptography</h3>
                  <p className="text-gray-500">Encryption, decryption, and cryptographic puzzles</p>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Forensics</h3>
                  <p className="text-gray-500">Digital forensics, file analysis, and data recovery</p>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">⚙️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Reverse Engineering</h3>
                  <p className="text-gray-500">Binary analysis, malware analysis, and code reversing</p>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">💥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Pwn</h3>
                  <p className="text-gray-500">Binary exploitation, buffer overflows, and ROP chains</p>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📁</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Miscellaneous</h3>
                  <p className="text-gray-500">OSINT, steganography, and other creative challenges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {session && (
          <div className="mt-20">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{session.user.score}</div>
                  <div className="text-gray-500">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success-600">0</div>
                  <div className="text-gray-500">Challenges Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">#1</div>
                  <div className="text-gray-500">Current Rank</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}