import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId } = await request.json()

    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        submissions: {
          where: { isCorrect: true },
          include: {
            challenge: {
              select: {
                category: true,
                points: true,
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const currentBadges = JSON.parse(user.badges || '[]')
    const newBadges = [...currentBadges]
    let hasNewBadges = false

    // Check for new badges
    const solvedChallenges = user.submissions.length
    const userScore = user.score

    // Count challenges by category
    const categoryCounts = user.submissions.reduce((acc: Record<string, number>, sub: any) => {
      const category = sub.challenge.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Badge conditions
    const badgeConditions = [
      {
        id: 'first_blood',
        condition: solvedChallenges >= 1 && !newBadges.includes('first_blood')
      },
      {
        id: 'web_master',
        condition: (categoryCounts.WEB || 0) >= 3 && !newBadges.includes('web_master')
      },
      {
        id: 'crypto_expert',
        condition: (categoryCounts.CRYPTO || 0) >= 3 && !newBadges.includes('crypto_expert')
      },
      {
        id: 'forensics_pro',
        condition: (categoryCounts.FORENSICS || 0) >= 3 && !newBadges.includes('forensics_pro')
      },
      {
        id: 'reverse_engineer',
        condition: (categoryCounts.REVERSE || 0) >= 3 && !newBadges.includes('reverse_engineer')
      },
      {
        id: 'pwn_master',
        condition: (categoryCounts.PWN || 0) >= 3 && !newBadges.includes('pwn_master')
      },
      {
        id: 'century_club',
        condition: userScore >= 100 && !newBadges.includes('century_club')
      },
      {
        id: 'half_century',
        condition: userScore >= 500 && !newBadges.includes('half_century')
      },
      {
        id: 'thousand_club',
        condition: userScore >= 1000 && !newBadges.includes('thousand_club')
      },
      {
        id: 'challenge_hunter',
        condition: solvedChallenges >= 10 && !newBadges.includes('challenge_hunter')
      }
    ]

    // Add new badges
    badgeConditions.forEach(({ id, condition }) => {
      if (condition) {
        newBadges.push(id)
        hasNewBadges = true
      }
    })

    // Update user badges if there are new ones
    if (hasNewBadges) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          badges: JSON.stringify(newBadges)
        }
      })
    }

    return NextResponse.json({
      badges: newBadges,
      newBadges: newBadges.filter(badge => !currentBadges.includes(badge))
    })

  } catch (error) {
    console.error('Error updating badges:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}