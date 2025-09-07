import { NextRequest, NextResponse } from 'next/server'
import { getChallengeById, updateChallenge, deleteChallenge, getSubmissionsByUser } from '@/lib/localAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challenge = getChallengeById(params.id)
    
    if (!challenge || !challenge.isActive) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Get user ID from query params or headers
    const userId = request.nextUrl.searchParams.get('userId')
    let isSolved = false
    
    if (userId) {
      const submissions = getSubmissionsByUser(userId)
      isSolved = submissions.some(sub => sub.challengeId === params.id && sub.isCorrect)
    }

    return NextResponse.json({
      ...challenge,
      isSolved
    })
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, category, difficulty, points, flag, hint, attachment, isActive } = body

    const challenge = updateChallenge(params.id, {
      title,
      description,
      category,
      difficulty,
      points,
      flag,
      hint,
      attachment,
      isActive,
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error updating challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteChallenge(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Challenge deleted successfully' })
  } catch (error) {
    console.error('Error deleting challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
