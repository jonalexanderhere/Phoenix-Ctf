import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      where: {
        isActive: true
      },
      include: {
        submissions: {
          where: { isCorrect: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(challenges, { status: 200 })
  } catch (error) {
    console.error('Challenges API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const challenge = await prisma.challenge.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        points: body.points,
        flag: body.flag,
        hint: body.hint,
        attachment: body.attachment,
        isActive: true
      }
    })
    
    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    console.error('Create challenge error:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}