import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { LazyChallengeHistory } from '@/components/LazyComponents'
import ChallengeCard from '@/components/ChallengeCard'
import { prisma } from '@/lib/prisma'
import { Challenge } from '@/types'

interface ChallengeDetailPageProps {
  params: { id: string }
}

async function getChallenge(challengeId: string, userId?: string) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        submissions: {
          where: { isCorrect: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'asc',
          },
        },
      },
    })

    if (!challenge) {
      return null
    }

    // Check if current user has solved this challenge
    let isSolved = false
    if (userId) {
      const userSubmission = await prisma.submission.findFirst({
        where: {
          userId: userId,
          challengeId: challengeId,
          isCorrect: true,
        },
      })
      isSolved = !!userSubmission
    }

    return {
      ...challenge,
      isSolved,
    } as Challenge & { isSolved: boolean }
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return null
  }
}

export default async function ChallengeDetailPage({ params }: ChallengeDetailPageProps) {
  const session = await getServerSession(authOptions)
  
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
