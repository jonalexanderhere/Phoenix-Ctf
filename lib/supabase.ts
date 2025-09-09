import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jbmocqjxoyqzuebnwihe.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibW9jcWp4b3lxenVlYm53aWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzA2MDcsImV4cCI6MjA3MzAwNjYwN30.L5fPvGE9f_ZV1-VEkhdE8JscvqbP4Gpqa1bFCrip_gA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibW9jcWp4b3lxenVlYm53aWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQzMDYwNywiZXhwIjoyMDczMDA2NjA3fQ.sTgs4yAKInw9-Fo8o81UeAnE2SWQ2EfsP8d5GZkpOTE',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
