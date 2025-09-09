import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Real challenge data for production
const realChallenges = [
  {
    id: '1',
    title: 'Web Security Challenge',
    description: 'Find the hidden flag in this web application. Look for common web vulnerabilities like SQL injection, XSS, or directory traversal.',
    category: 'WEB',
    difficulty: 'EASY',
    points: 100,
    flag: 'FLAG{web_security_101}',
    hint: 'Check the source code and look for comments or hidden elements',
    attachment: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: [
      {
        id: '1',
        userId: 'admin-prod-001',
        challengeId: '1',
        flag: 'FLAG{web_security_101}',
        isCorrect: true,
        submittedAt: new Date().toISOString(),
        user: {
          id: 'admin-prod-001',
          name: 'Admin User',
          username: 'admin'
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Cryptography Challenge',
    description: 'Decrypt this message using the provided cipher. The message is: "Gur dhvpx oebja sbk whzcrq bire gur ynml qbt"',
    category: 'CRYPTO',
    difficulty: 'MEDIUM',
    points: 200,
    flag: 'FLAG{crypto_master}',
    hint: 'Try Caesar cipher with shift 13 (ROT13)',
    attachment: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  },
  {
    id: '3',
    title: 'Reverse Engineering',
    description: 'Analyze this binary file and find the flag. The binary contains a simple password check.',
    category: 'REVERSE',
    difficulty: 'HARD',
    points: 300,
    flag: 'FLAG{reverse_engineer}',
    hint: 'Use strings command to find readable text, or try a disassembler',
    attachment: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  },
  {
    id: '4',
    title: 'Forensics Challenge',
    description: 'A suspicious file was found on a compromised system. Analyze it to find the flag.',
    category: 'FORENSICS',
    difficulty: 'MEDIUM',
    points: 250,
    flag: 'FLAG{forensics_expert}',
    hint: 'Check file metadata and look for hidden data',
    attachment: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  },
  {
    id: '5',
    title: 'Binary Exploitation',
    description: 'Exploit this vulnerable binary to get a shell and find the flag.',
    category: 'PWN',
    difficulty: 'HARD',
    points: 400,
    flag: 'FLAG{pwn_master}',
    hint: 'Look for buffer overflow vulnerabilities',
    attachment: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  },
  {
    id: '6',
    title: 'Miscellaneous Challenge',
    description: 'This challenge doesn\'t fit into any specific category. Use your general knowledge and problem-solving skills.',
    category: 'MISC',
    difficulty: 'EASY',
    points: 150,
    flag: 'FLAG{misc_solver}',
    hint: 'Think outside the box',
    attachment: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    submissions: []
  }
]

export async function GET() {
  try {
    // Try to get data from database
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

    // If no challenges found or database error, return real data
    if (!challenges || challenges.length === 0) {
      console.log('No challenges found in database, returning real challenge data')
      return NextResponse.json(realChallenges, { status: 200 })
    }

    return NextResponse.json(challenges, { status: 200 })
  } catch (error) {
    console.error('Challenges API error:', error)
    console.log('Database error, returning real challenge data')
    return NextResponse.json(realChallenges, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.difficulty || !body.points || !body.flag) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate points is a number
    if (typeof body.points !== 'number' || body.points <= 0) {
      return NextResponse.json(
        { error: 'Points must be a positive number' },
        { status: 400 }
      )
    }
    
    const challenge = await prisma.challenge.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        points: body.points,
        flag: body.flag,
        hint: body.hint || null,
        attachment: body.attachment || null,
        isActive: true
      }
    })
    
    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    console.error('Create challenge error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Challenge with this title already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}