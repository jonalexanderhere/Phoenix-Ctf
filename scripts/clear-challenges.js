const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearChallenges() {
  try {
    console.log('🗑️  Clearing all challenges...')
    
    // Delete all submissions first (foreign key constraint)
    const deletedSubmissions = await prisma.submission.deleteMany({})
    console.log(`✅ Deleted ${deletedSubmissions.count} submissions`)
    
    // Delete all challenges
    const deletedChallenges = await prisma.challenge.deleteMany({})
    console.log(`✅ Deleted ${deletedChallenges.count} challenges`)
    
    // Reset user scores
    const resetUsers = await prisma.user.updateMany({
      data: {
        score: 0,
        solvedCount: 0
      }
    })
    console.log(`✅ Reset scores for ${resetUsers.count} users`)
    
    console.log('🎉 Database cleared successfully!')
  } catch (error) {
    console.error('❌ Error clearing database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearChallenges()
