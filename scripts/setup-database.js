const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jbmocqjxoyqzuebnwihe.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibW9jcWp4b3lxenVlYm53aWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQzMDYwNywiZXhwIjoyMDczMDA2NjA3fQ.sTgs4yAKInw9-Fo8o81UeAnE2SWQ2EfsP8d5GZkpOTE'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Supabase database...')
    
    // Test connection first
    console.log('Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Database tables not found. Please run the SQL schema first.')
      console.log('')
      console.log('📋 To setup the database:')
      console.log('1. Go to https://supabase.com/dashboard')
      console.log('2. Select project: jbmocqjxoyqzuebnwihe')
      console.log('3. Go to SQL Editor')
      console.log('4. Run the SQL from supabase-schema.sql file')
      console.log('')
      console.log('Or use Supabase CLI:')
      console.log('npx supabase db reset')
      return false
    }
    
    console.log('✅ Database connection successful')
    
    // Check if admin user exists
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@ctf.com')
      .single()
    
    if (adminError && adminError.code === 'PGRST116') {
      console.log('Creating admin user...')
      const { data: newAdmin, error: createError } = await supabase
        .from('users')
        .insert({
          id: 'admin-prod-001',
          name: 'Admin User',
          email: 'admin@ctf.com',
          username: 'admin',
          password: '$2b$12$wDuNwtyQOiO7HpuG5TG6Nu3sLzSteQ7dvMR4M8OcfNmRM968WXIf.',
          role: 'ADMIN',
          score: 1000,
          badges: JSON.stringify(['First Blood', 'Admin', 'Web Security Expert'])
        })
        .select()
        .single()
      
      if (createError) {
        console.error('❌ Error creating admin user:', createError)
        return false
      }
      
      console.log('✅ Admin user created successfully')
    } else if (adminUser) {
      console.log('✅ Admin user already exists')
    }
    
    // Test all tables
    console.log('Testing tables...')
    
    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (usersError) {
      console.error('❌ Users table error:', usersError)
      return false
    }
    console.log('✅ Users table accessible')
    
    // Test challenges table
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('count')
      .limit(1)
    
    if (challengesError) {
      console.error('❌ Challenges table error:', challengesError)
      return false
    }
    console.log('✅ Challenges table accessible')
    
    // Test submissions table
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('count')
      .limit(1)
    
    if (submissionsError) {
      console.error('❌ Submissions table error:', submissionsError)
      return false
    }
    console.log('✅ Submissions table accessible')
    
    console.log('')
    console.log('🎉 Database setup completed successfully!')
    console.log('✅ All tables are accessible')
    console.log('✅ Admin user is ready')
    console.log('✅ System is ready for production')
    
    return true
    
  } catch (error) {
    console.error('❌ Setup error:', error)
    return false
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase().then(success => {
    process.exit(success ? 0 : 1)
  })
}

module.exports = { setupDatabase }
