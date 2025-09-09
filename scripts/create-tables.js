const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jbmocqjxoyqzuebnwihe.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibW9jcWp4b3lxenVlYm53aWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQzMDYwNywiZXhwIjoyMDczMDA2NjA3fQ.sTgs4yAKInw9-Fo8o81UeAnE2SWQ2EfsP8d5GZkpOTE'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTables() {
  try {
    console.log('Creating database tables...')
    
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
        score INTEGER DEFAULT 0,
        badges JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    // Create challenges table
    const createChallengesTable = `
      CREATE TABLE IF NOT EXISTS challenges (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
        points INTEGER NOT NULL,
        flag VARCHAR(255) NOT NULL,
        hint TEXT,
        attachment TEXT,
        is_active BOOLEAN DEFAULT true,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    // Create submissions table
    const createSubmissionsTable = `
      CREATE TABLE IF NOT EXISTS submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
        flag VARCHAR(255) NOT NULL,
        is_correct BOOLEAN NOT NULL,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    // Execute table creation
    const { error: usersError } = await supabase.rpc('exec_sql', { sql: createUsersTable })
    if (usersError) {
      console.error('Error creating users table:', usersError)
    } else {
      console.log('✅ Users table created')
    }
    
    const { error: challengesError } = await supabase.rpc('exec_sql', { sql: createChallengesTable })
    if (challengesError) {
      console.error('Error creating challenges table:', challengesError)
    } else {
      console.log('✅ Challenges table created')
    }
    
    const { error: submissionsError } = await supabase.rpc('exec_sql', { sql: createSubmissionsTable })
    if (submissionsError) {
      console.error('Error creating submissions table:', submissionsError)
    } else {
      console.log('✅ Submissions table created')
    }
    
    // Create admin user
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
        console.error('Error creating admin user:', createError)
      } else {
        console.log('✅ Admin user created')
      }
    } else {
      console.log('✅ Admin user already exists')
    }
    
    console.log('🎉 Database setup completed!')
    return true
    
  } catch (error) {
    console.error('Setup error:', error)
    return false
  }
}

// Run setup if called directly
if (require.main === module) {
  createTables().then(success => {
    process.exit(success ? 0 : 1)
  })
}

module.exports = { createTables }
