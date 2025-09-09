const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jbmocqjxoyqzuebnwihe.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibW9jcWp4b3lxenVlYm53aWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQzMDYwNywiZXhwIjoyMDczMDA2NjA3fQ.sTgs4yAKInw9-Fo8o81UeAnE2SWQ2EfsP8d5GZkpOTE'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function initDatabase() {
  try {
    console.log('Initializing Supabase database...')
    
    // Test basic connection
    console.log('Testing connection...')
    
    // Try to create a simple test
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('Tables not found, this is expected for first run')
      console.log('Please run the SQL schema in Supabase dashboard:')
      console.log('')
      console.log('1. Go to https://supabase.com/dashboard')
      console.log('2. Select your project: jbmocqjxoyqzuebnwihe')
      console.log('3. Go to SQL Editor')
      console.log('4. Run the SQL from supabase-schema.sql file')
      console.log('')
      console.log('Or use the Supabase CLI:')
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
        console.error('Error creating admin user:', createError)
        return false
      }
      
      console.log('✅ Admin user created successfully')
    } else if (adminUser) {
      console.log('✅ Admin user already exists')
    }
    
    console.log('🎉 Database initialization completed!')
    return true
    
  } catch (error) {
    console.error('Initialization error:', error)
    console.log('')
    console.log('Please ensure:')
    console.log('1. Supabase project is active')
    console.log('2. Database tables are created (run supabase-schema.sql)')
    console.log('3. Service role key is correct')
    return false
  }
}

// Run initialization if called directly
if (require.main === module) {
  initDatabase().then(success => {
    process.exit(success ? 0 : 1)
  })
}

module.exports = { initDatabase }
