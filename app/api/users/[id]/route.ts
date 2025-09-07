import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      include: {
        submissions: {
          include: {
            challenge: {
              select: {
                id: true,
                title: true,
                category: true,
                difficulty: true,
                points: true,
              }
            }
          },
          orderBy: {
            submittedAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        id: params.id,
        name: 'Guest User',
        email: 'guest@example.com',
        username: 'guest',
        score: 0,
        badges: [],
        createdAt: new Date().toISOString(),
        submissions: []
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({
      id: params.id,
      name: 'User',
      email: 'user@example.com',
      username: 'user',
      score: 0,
      badges: [],
      createdAt: new Date().toISOString(),
      submissions: []
    })
  }
}