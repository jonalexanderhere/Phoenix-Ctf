import { NextRequest, NextResponse } from 'next/server'
import { getChallengeById, createSubmission, getSubmissionsByUser } from '@/lib/localAuth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { flag, userId } = body

    if (!flag || !userId) {
      return NextResponse.json(
        { error: 'Flag and userId are required' },
        { status: 400 }
      )
    }

    const challenge = getChallengeById(params.id)
    
    if (!challenge || !challenge.isActive) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Check if user already solved this challenge
    const userSubmissions = getSubmissionsByUser(userId)
    const alreadySolved = userSubmissions.some(sub => 
      sub.challengeId === params.id && sub.isCorrect
    )

    if (alreadySolved) {
      return NextResponse.json(
        { error: 'Challenge already solved' },
        { status: 400 }
      )
    }

    const isCorrect = flag === challenge.flag

    const submission = createSubmission({
      userId,
      challengeId: params.id,
      flag,
      isCorrect
    })

    return NextResponse.json({
      submission,
      isCorrect,
      message: isCorrect ? 'Correct flag!' : 'Incorrect flag. Try again!'
    })
  } catch (error) {
    console.error('Error submitting flag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}