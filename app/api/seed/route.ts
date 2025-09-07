import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@ctf.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@ctf.com',
        username: 'admin',
        password: adminPassword,
        role: 'ADMIN',
      },
    })

    // Create sample challenges
    const challenges = [
      {
        title: 'Welcome Challenge',
        description: 'This is your first challenge! The flag is hidden somewhere in this description. Look carefully for the pattern: CTF{hello_world}',
        category: 'MISC',
        difficulty: 'EASY',
        points: 10,
        flag: 'CTF{hello_world}',
        hint: 'Look for text in curly braces',
      },
      {
        title: 'Base64 Decoder',
        description: 'Decode this base64 string: V2VsY29tZSB0byBvdXIgQ1RGIGNvbXBldGl0aW9uIQ==',
        category: 'CRYPTO',
        difficulty: 'EASY',
        points: 25,
        flag: 'CTF{base64_is_easy}',
        hint: 'Use an online base64 decoder',
      },
      {
        title: 'Simple Web Challenge',
        description: 'Visit the URL: http://localhost:3000/web-challenge and find the hidden flag',
        category: 'WEB',
        difficulty: 'MEDIUM',
        points: 50,
        flag: 'CTF{web_exploitation}',
        hint: 'Check the page source',
        attachment: 'http://localhost:3000/web-challenge',
      },
      {
        title: 'File Analysis',
        description: 'Download and analyze this file to find the flag. The file contains hidden information.',
        category: 'FORENSICS',
        difficulty: 'MEDIUM',
        points: 75,
        flag: 'CTF{forensics_master}',
        hint: 'Check file metadata and hidden data',
        attachment: 'https://example.com/sample-file.zip',
      },
      {
        title: 'Reverse Engineering',
        description: 'Analyze this binary file and find the correct input that produces the flag.',
        category: 'REVERSE',
        difficulty: 'HARD',
        points: 100,
        flag: 'CTF{reverse_engineer}',
        hint: 'Use a disassembler or debugger',
        attachment: 'https://example.com/challenge-binary',
      },
      {
        title: 'Buffer Overflow',
        description: 'Exploit the buffer overflow vulnerability in this program to get a shell.',
        category: 'PWN',
        difficulty: 'HARD',
        points: 150,
        flag: 'CTF{pwn_master}',
        hint: 'Find the vulnerable function and craft your payload',
        attachment: 'https://example.com/vulnerable-program',
      },
    ]

    for (const challenge of challenges) {
      await prisma.challenge.create({
        data: challenge,
      })
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      admin: {
        email: admin.email,
        username: admin.username,
        password: 'admin123',
      },
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}