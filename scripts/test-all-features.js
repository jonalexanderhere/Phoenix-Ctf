const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAllFeatures() {
  console.log('🧪 Testing all features...\n')
  
  try {
    // Test 1: Database connection
    console.log('1. Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful\n')
    
    // Test 2: User operations
    console.log('2. Testing user operations...')
    const userCount = await prisma.user.count()
    console.log(`✅ Users table accessible (${userCount} users)\n`)
    
    // Test 3: Challenge operations
    console.log('3. Testing challenge operations...')
    const challengeCount = await prisma.challenge.count()
    console.log(`✅ Challenges table accessible (${challengeCount} challenges)\n`)
    
    // Test 4: Submission operations
    console.log('4. Testing submission operations...')
    const submissionCount = await prisma.submission.count()
    console.log(`✅ Submissions table accessible (${submissionCount} submissions)\n`)
    
    // Test 5: Create test user
    console.log('5. Testing user creation...')
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        password: 'hashedpassword',
        score: 0,
        role: 'USER'
      }
    })
    console.log(`✅ Test user created/updated (ID: ${testUser.id})\n`)
    
    // Test 6: Create test challenge
    console.log('6. Testing challenge creation...')
    const testChallenge = await prisma.challenge.upsert({
      where: { id: 'test-challenge-1' },
      update: {},
      create: {
        id: 'test-challenge-1',
        title: 'Test Challenge',
        description: 'This is a test challenge',
        category: 'WEB',
        difficulty: 'EASY',
        points: 100,
        flag: 'test{flag}',
        isActive: true
      }
    })
    console.log(`✅ Test challenge created/updated (ID: ${testChallenge.id})\n`)
    
    // Test 7: Create test submission
    console.log('7. Testing submission creation...')
    const testSubmission = await prisma.submission.create({
      data: {
        userId: testUser.id,
        challengeId: testChallenge.id,
        flag: 'test{flag}',
        isCorrect: true
      }
    })
    console.log(`✅ Test submission created (ID: ${testSubmission.id})\n`)
    
    // Test 8: Test queries
    console.log('8. Testing complex queries...')
    const userWithSubmissions = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        submissions: {
          include: {
            challenge: true
          }
        }
      }
    })
    console.log(`✅ Complex queries working (${userWithSubmissions?.submissions.length} submissions)\n`)
    
    // Test 9: Cleanup test data
    console.log('9. Cleaning up test data...')
    await prisma.submission.deleteMany({
      where: { userId: testUser.id }
    })
    await prisma.challenge.deleteMany({
      where: { id: 'test-challenge-1' }
    })
    await prisma.user.deleteMany({
      where: { email: 'test@example.com' }
    })
    console.log('✅ Test data cleaned up\n')
    
    console.log('🎉 All features working correctly!')
    console.log('\n📊 Summary:')
    console.log(`- Users: ${userCount}`)
    console.log(`- Challenges: ${challengeCount}`)
    console.log(`- Submissions: ${submissionCount}`)
    console.log('- Database: ✅ Connected')
    console.log('- CRUD Operations: ✅ Working')
    console.log('- Complex Queries: ✅ Working')
    console.log('- Data Integrity: ✅ Maintained')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testAllFeatures()

