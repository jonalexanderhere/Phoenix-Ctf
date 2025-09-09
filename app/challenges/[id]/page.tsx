import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { LazyChallengeHistory } from '@/components/LazyComponents'
import ChallengeCard from '@/components/ChallengeCard'
import { Challenge } from '@/types'

interface ChallengeDetailPageProps {
  params: { id: string }
}

async function getChallenge(challengeId: string, userId?: string) {
  try {
    // For production, use mock data since we don't have database
    const mockChallenges = [
      {
        id: '1',
        title: 'Web Security Challenge',
        description: 'Find the hidden flag in this web application. Look for common web vulnerabilities.',
        category: 'WEB',
        difficulty: 'EASY',
        points: 100,
        flag: 'FLAG{web_security_101}',
        hint: 'Check the source code and look for comments',
        attachment: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        submissions: [
          {
            id: '1',
            userId: 'admin-prod-001',
            challengeId: '1',
            flag: 'FLAG{web_security_101}',
            isCorrect: true,
            submittedAt: new Date(),
            user: {
              id: 'admin-prod-001',
              name: 'Admin User',
              username: 'admin'
            }
          }
        ],
        isSolved: userId === 'admin-prod-001'
      },
      {
        id: '2',
        title: 'Cryptography Challenge',
        description: 'Decrypt this message using the provided cipher.',
        category: 'CRYPTO',
        difficulty: 'MEDIUM',
        points: 200,
        flag: 'FLAG{crypto_master}',
        hint: 'Try Caesar cipher with shift 13',
        attachment: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        submissions: [],
        isSolved: false
      },
      {
        id: '3',
        title: 'Reverse Engineering',
        description: 'Analyze this binary file and find the flag.',
        category: 'REVERSE',
        difficulty: 'HARD',
        points: 300,
        flag: 'FLAG{reverse_engineer}',
        hint: 'Use strings command to find readable text',
        attachment: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        submissions: [],
        isSolved: false
      }
    ]

    const challenge = mockChallenges.find(c => c.id === challengeId)
    
    if (!challenge) {
      return null
    }

    return challenge as Challenge & { isSolved: boolean }
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return null
  }
}

async function getSession() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('auth-session')
    
    if (!sessionCookie) {
      return null
    }
    
    const sessionData = JSON.parse(sessionCookie.value)
    
    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      return null
    }
    
    return sessionData
  } catch (error) {
    console.error('Session check error:', error)
    return null
  }
}

export default async function ChallengeDetailPage({ params }: ChallengeDetailPageProps) {
  const session = await getSession()
  
  if (!session) {
    redirect('/auth/signin')
  }

  const challenge = await getChallenge(params.id, session.user.id)

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Challenge Not Found</h1>
            <p className="text-gray-600 mb-8">The challenge you&apos;re looking for doesn&apos;t exist.</p>
            <a
              href="/challenges"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Challenges
            </a>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <a
            href="/challenges"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Challenges
          </a>
          <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
          <p className="mt-2 text-gray-600">{challenge.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenge Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ChallengeCard 
                challenge={{
                  ...challenge,
                  hint: challenge.hint || undefined,
                  attachment: challenge.attachment || undefined,
                }}
                showDescription={true}
                showSubmissionForm={true}
              />
            </div>
          </div>

          {/* Challenge History */}
          <div className="lg:col-span-1">
            <LazyChallengeHistory 
              challengeId={challenge.id}
              challengeTitle={challenge.title}
              limit={10}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
